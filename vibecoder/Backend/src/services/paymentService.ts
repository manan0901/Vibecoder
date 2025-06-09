import Razorpay from 'razorpay';
import crypto from 'crypto';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

// Payment status enum
export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}

// Transaction types
export enum TransactionType {
  PURCHASE = 'PURCHASE',
  REFUND = 'REFUND',
  COMMISSION = 'COMMISSION'
}

// Payment method types
export enum PaymentMethod {
  CARD = 'CARD',
  UPI = 'UPI',
  NETBANKING = 'NETBANKING',
  WALLET = 'WALLET',
  EMI = 'EMI'
}

// Interface for creating payment order
export interface CreatePaymentOrderData {
  projectId: string;
  buyerId: string;
  amount: number;
  currency?: string;
  description?: string;
}

// Interface for payment verification
export interface PaymentVerificationData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Interface for payment order response
export interface PaymentOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  created_at: number;
}

// Calculate platform commission (10% for now)
const calculateCommission = (amount: number): number => {
  const commissionRate = 0.10; // 10%
  return Math.round(amount * commissionRate);
};

// Calculate seller amount after commission
const calculateSellerAmount = (amount: number): number => {
  const commission = calculateCommission(amount);
  return amount - commission;
};

// Generate unique receipt ID
const generateReceiptId = (projectId: string, buyerId: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `VBC_${projectId.substring(0, 8)}_${buyerId.substring(0, 8)}_${timestamp}_${random}`;
};

// Create payment order
export const createPaymentOrder = async (data: CreatePaymentOrderData): Promise<{
  order: PaymentOrderResponse;
  transaction: any;
}> => {
  try {
    const { projectId, buyerId, amount, currency = 'INR', description } = data;

    // Validate project exists and is available for purchase
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    if (project.status !== 'APPROVED') {
      throw new AppError('Project is not available for purchase', 400);
    }

    // Check if buyer already owns this project
    const existingPurchase = await prisma.transaction.findFirst({
      where: {
        projectId,
        buyerId,
        status: PaymentStatus.COMPLETED,
        type: TransactionType.PURCHASE,
      },
    });

    if (existingPurchase) {
      throw new AppError('You have already purchased this project', 400);
    }

    // Validate amount matches project price
    if (amount !== project.price) {
      throw new AppError('Payment amount does not match project price', 400);
    }

    // Generate receipt ID
    const receiptId = generateReceiptId(projectId, buyerId);

    // Create Razorpay order
    const orderOptions = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: receiptId,
      notes: {
        project_id: projectId,
        buyer_id: buyerId,
        seller_id: project.sellerId,
        project_title: project.title,
      },
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // Calculate commission and seller amount
    const commission = calculateCommission(amount);
    const sellerAmount = calculateSellerAmount(amount);

    // Create transaction record in database
    const transaction = await prisma.transaction.create({
      data: {
        id: razorpayOrder.id, // Use Razorpay order ID as transaction ID
        projectId,
        buyerId,
        sellerId: project.sellerId,
        amount,
        commission,
        sellerAmount,
        currency,
        status: PaymentStatus.PENDING,
        type: TransactionType.PURCHASE,
        paymentGateway: 'RAZORPAY',
        razorpayOrderId: razorpayOrder.id,
        receiptId,
        description: description || `Purchase of ${project.title}`,
        metadata: {
          project_title: project.title,
          seller_name: `${project.seller.firstName} ${project.seller.lastName}`,
          razorpay_order: razorpayOrder,
        },
      },
    });

    return {
      order: razorpayOrder as PaymentOrderResponse,
      transaction,
    };

  } catch (error) {
    console.error('Error creating payment order:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to create payment order', 500);
  }
};

// Verify payment signature
export const verifyPaymentSignature = (data: PaymentVerificationData): boolean => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
    
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(body.toString())
      .digest('hex');

    return expectedSignature === razorpay_signature;
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return false;
  }
};

// Process successful payment
export const processSuccessfulPayment = async (
  orderId: string,
  paymentId: string,
  signature: string,
  paymentMethod?: PaymentMethod
): Promise<any> => {
  try {
    // Verify payment signature
    const isValidSignature = verifyPaymentSignature({
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    });

    if (!isValidSignature) {
      throw new AppError('Invalid payment signature', 400);
    }

    // Get payment details from Razorpay
    const payment = await razorpay.payments.fetch(paymentId);

    // Update transaction in database
    const transaction = await prisma.transaction.update({
      where: { id: orderId },
      data: {
        status: PaymentStatus.COMPLETED,
        razorpayPaymentId: paymentId,
        paymentMethod: paymentMethod || PaymentMethod.CARD,
        completedAt: new Date(),
        metadata: {
          payment_details: payment,
          verified_at: new Date().toISOString(),
        },
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            sellerId: true,
          },
        },
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Update project download count
    await prisma.project.update({
      where: { id: transaction.projectId },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    });

    // Create commission transaction for platform
    await prisma.transaction.create({
      data: {
        projectId: transaction.projectId,
        buyerId: transaction.buyerId,
        sellerId: transaction.sellerId,
        amount: transaction.commission,
        commission: 0,
        sellerAmount: 0,
        currency: transaction.currency,
        status: PaymentStatus.COMPLETED,
        type: TransactionType.COMMISSION,
        paymentGateway: 'RAZORPAY',
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        receiptId: `COMM_${transaction.receiptId}`,
        description: `Platform commission for ${transaction.project.title}`,
        completedAt: new Date(),
        metadata: {
          original_transaction_id: orderId,
          commission_rate: '10%',
        },
      },
    });

    // TODO: Send email notifications to buyer and seller
    // TODO: Create download access record

    return transaction;

  } catch (error) {
    console.error('Error processing successful payment:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to process payment', 500);
  }
};

// Handle failed payment
export const processFailedPayment = async (
  orderId: string,
  paymentId?: string,
  errorCode?: string,
  errorDescription?: string
): Promise<any> => {
  try {
    const transaction = await prisma.transaction.update({
      where: { id: orderId },
      data: {
        status: PaymentStatus.FAILED,
        razorpayPaymentId: paymentId,
        failedAt: new Date(),
        metadata: {
          error_code: errorCode,
          error_description: errorDescription,
          failed_at: new Date().toISOString(),
        },
      },
    });

    // TODO: Send failure notification to buyer
    // TODO: Log failure for analytics

    return transaction;

  } catch (error) {
    console.error('Error processing failed payment:', error);
    throw new AppError('Failed to process payment failure', 500);
  }
};

// Get payment status
export const getPaymentStatus = async (orderId: string): Promise<any> => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: orderId },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    return transaction;

  } catch (error) {
    console.error('Error getting payment status:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to get payment status', 500);
  }
};

// Initiate refund
export const initiateRefund = async (
  transactionId: string,
  amount?: number,
  reason?: string
): Promise<any> => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    if (transaction.status !== PaymentStatus.COMPLETED) {
      throw new AppError('Only completed transactions can be refunded', 400);
    }

    if (!transaction.razorpayPaymentId) {
      throw new AppError('Payment ID not found for refund', 400);
    }

    const refundAmount = amount || transaction.amount;

    // Create refund in Razorpay
    const refund = await razorpay.payments.refund(transaction.razorpayPaymentId, {
      amount: refundAmount * 100, // Amount in paise
      notes: {
        reason: reason || 'Customer requested refund',
        original_transaction_id: transactionId,
      },
    });

    // Create refund transaction record
    const refundTransaction = await prisma.transaction.create({
      data: {
        projectId: transaction.projectId,
        buyerId: transaction.buyerId,
        sellerId: transaction.sellerId,
        amount: refundAmount,
        commission: 0,
        sellerAmount: 0,
        currency: transaction.currency,
        status: PaymentStatus.COMPLETED,
        type: TransactionType.REFUND,
        paymentGateway: 'RAZORPAY',
        razorpayOrderId: transaction.razorpayOrderId,
        razorpayPaymentId: transaction.razorpayPaymentId,
        receiptId: `REFUND_${transaction.receiptId}`,
        description: `Refund for ${reason || 'customer request'}`,
        completedAt: new Date(),
        metadata: {
          original_transaction_id: transactionId,
          refund_details: refund,
          refund_reason: reason,
        },
      },
    });

    // Update original transaction status
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: PaymentStatus.REFUNDED,
        metadata: {
          ...transaction.metadata,
          refund_transaction_id: refundTransaction.id,
          refunded_at: new Date().toISOString(),
        },
      },
    });

    return refundTransaction;

  } catch (error) {
    console.error('Error initiating refund:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to initiate refund', 500);
  }
};

// Get transaction history for user
export const getUserTransactions = async (
  userId: string,
  type: 'buyer' | 'seller',
  page: number = 1,
  limit: number = 10
): Promise<any> => {
  try {
    const skip = (page - 1) * limit;
    const whereClause = type === 'buyer' ? { buyerId: userId } : { sellerId: userId };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: whereClause,
        include: {
          project: {
            select: {
              id: true,
              title: true,
              category: true,
            },
          },
          buyer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.transaction.count({
        where: whereClause,
      }),
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

  } catch (error) {
    console.error('Error getting user transactions:', error);
    throw new AppError('Failed to get transaction history', 500);
  }
};
