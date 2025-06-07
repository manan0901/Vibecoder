import { Request, Response, NextFunction } from 'express';
import { AppError, catchAsync } from '../middleware/errorHandler';
import { logApiResponse } from '../middleware/requestLogger';
import {
  createPaymentOrder,
  processSuccessfulPayment,
  processFailedPayment,
  getPaymentStatus,
  initiateRefund,
  getUserTransactions,
  PaymentMethod,
} from '../services/paymentService';

// Create payment order
export const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { projectId, amount, currency, description } = req.body;

  if (!projectId || !amount) {
    throw new AppError('Project ID and amount are required', 400);
  }

  if (amount <= 0) {
    throw new AppError('Amount must be greater than 0', 400);
  }

  const orderData = {
    projectId,
    buyerId: req.user.id,
    amount: parseInt(amount),
    currency: currency || 'INR',
    description,
  };

  const { order, transaction } = await createPaymentOrder(orderData);

  const response = {
    success: true,
    message: 'Payment order created successfully',
    data: {
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        status: transaction.status,
        projectId: transaction.projectId,
      },
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    },
  };

  logApiResponse(response, 'Payment order created');
  res.status(201).json(response);
});

// Verify payment
export const verifyPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, payment_method } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new AppError('Missing required payment verification data', 400);
  }

  const transaction = await processSuccessfulPayment(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    payment_method as PaymentMethod
  );

  const response = {
    success: true,
    message: 'Payment verified successfully',
    data: {
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        status: transaction.status,
        projectId: transaction.projectId,
        project: transaction.project,
        completedAt: transaction.completedAt,
      },
    },
  };

  logApiResponse(response, 'Payment verified successfully');
  res.status(200).json(response);
});

// Handle payment failure
export const handlePaymentFailure = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { order_id, payment_id, error_code, error_description } = req.body;

  if (!order_id) {
    throw new AppError('Order ID is required', 400);
  }

  const transaction = await processFailedPayment(
    order_id,
    payment_id,
    error_code,
    error_description
  );

  const response = {
    success: true,
    message: 'Payment failure recorded',
    data: {
      transaction: {
        id: transaction.id,
        status: transaction.status,
        failedAt: transaction.failedAt,
      },
    },
  };

  logApiResponse(response, 'Payment failure handled');
  res.status(200).json(response);
});

// Get payment status
export const getOrderStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { orderId } = req.params;

  if (!orderId) {
    throw new AppError('Order ID is required', 400);
  }

  const transaction = await getPaymentStatus(orderId);

  // Check if user has access to this transaction
  if (transaction.buyerId !== req.user.id && transaction.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new AppError('You do not have access to this transaction', 403);
  }

  const response = {
    success: true,
    message: 'Payment status retrieved successfully',
    data: {
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        status: transaction.status,
        type: transaction.type,
        paymentMethod: transaction.paymentMethod,
        projectId: transaction.projectId,
        project: transaction.project,
        buyer: transaction.buyer,
        createdAt: transaction.createdAt,
        completedAt: transaction.completedAt,
        failedAt: transaction.failedAt,
      },
    },
  };

  logApiResponse(response, 'Payment status retrieved');
  res.status(200).json(response);
});

// Get user transaction history
export const getTransactionHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { type = 'buyer', page = '1', limit = '10' } = req.query;

  if (type !== 'buyer' && type !== 'seller') {
    throw new AppError('Type must be either "buyer" or "seller"', 400);
  }

  // Only allow users to view their own transactions
  const userId = req.user.id;
  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 10;

  if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
    throw new AppError('Invalid pagination parameters', 400);
  }

  const result = await getUserTransactions(userId, type as 'buyer' | 'seller', pageNum, limitNum);

  const response = {
    success: true,
    message: 'Transaction history retrieved successfully',
    data: result,
  };

  logApiResponse(response, 'Transaction history retrieved');
  res.status(200).json(response);
});

// Initiate refund (Admin only)
export const refundPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'ADMIN') {
    throw new AppError('Only admins can initiate refunds', 403);
  }

  const { transactionId, amount, reason } = req.body;

  if (!transactionId) {
    throw new AppError('Transaction ID is required', 400);
  }

  const refundTransaction = await initiateRefund(
    transactionId,
    amount ? parseInt(amount) : undefined,
    reason
  );

  const response = {
    success: true,
    message: 'Refund initiated successfully',
    data: {
      refund: {
        id: refundTransaction.id,
        amount: refundTransaction.amount,
        status: refundTransaction.status,
        originalTransactionId: transactionId,
        reason,
        completedAt: refundTransaction.completedAt,
      },
    },
  };

  logApiResponse(response, 'Refund initiated');
  res.status(200).json(response);
});

// Get payment analytics (Seller/Admin)
export const getPaymentAnalytics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'SELLER' && req.user.role !== 'ADMIN') {
    throw new AppError('Only sellers and admins can view payment analytics', 403);
  }

  // TODO: Implement actual analytics calculation
  // For now, return mock data
  const analytics = {
    totalEarnings: 25000,
    totalTransactions: 45,
    successfulTransactions: 42,
    failedTransactions: 3,
    averageOrderValue: 2500,
    monthlyEarnings: [
      { month: 'Jan', earnings: 5000 },
      { month: 'Feb', earnings: 7500 },
      { month: 'Mar', earnings: 12500 },
    ],
    topProjects: [
      { title: 'React Dashboard', earnings: 8000, sales: 4 },
      { title: 'Mobile App', earnings: 6000, sales: 3 },
      { title: 'API Service', earnings: 4500, sales: 2 },
    ],
    paymentMethods: {
      UPI: 60,
      CARD: 30,
      NETBANKING: 8,
      WALLET: 2,
    },
  };

  const response = {
    success: true,
    message: 'Payment analytics retrieved successfully',
    data: { analytics },
  };

  logApiResponse(response, 'Payment analytics retrieved');
  res.status(200).json(response);
});

// Webhook handler for Razorpay
export const handleWebhook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const signature = req.headers['x-razorpay-signature'] as string;
  const body = JSON.stringify(req.body);

  // Verify webhook signature
  const expectedSignature = require('crypto')
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret')
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    throw new AppError('Invalid webhook signature', 400);
  }

  const event = req.body;

  // Handle different webhook events
  switch (event.event) {
    case 'payment.captured':
      // Payment was successfully captured
      console.log('Payment captured:', event.payload.payment.entity);
      break;

    case 'payment.failed':
      // Payment failed
      console.log('Payment failed:', event.payload.payment.entity);
      break;

    case 'order.paid':
      // Order was paid
      console.log('Order paid:', event.payload.order.entity);
      break;

    default:
      console.log('Unhandled webhook event:', event.event);
  }

  const response = {
    success: true,
    message: 'Webhook processed successfully',
  };

  logApiResponse(response, 'Webhook processed');
  res.status(200).json(response);
});
