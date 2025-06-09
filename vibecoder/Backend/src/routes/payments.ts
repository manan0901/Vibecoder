import { Router } from 'express';
import {
  createOrder,
  verifyPayment,
  handlePaymentFailure,
  getOrderStatus,
  getTransactionHistory,
  refundPayment,
  getPaymentAnalytics,
  handleWebhook,
} from '../controllers/paymentController';
import { authenticate, adminOnly, sellerOnly } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { apiLimiter, paymentLimiter } from '../middleware/rateLimiter';
import { z } from 'zod';

const router = Router();

// Webhook endpoint (no authentication required)
router.post('/webhook', 
  handleWebhook
);

// All other payment routes require authentication
router.use(authenticate);

// Create payment order
router.post('/orders', 
  paymentLimiter,
  validateRequest({
    body: z.object({
      projectId: z.string().min(1, 'Project ID is required'),
      amount: z.number().positive('Amount must be positive'),
      currency: z.string().optional(),
      description: z.string().optional(),
    })
  }),
  createOrder
);

// Verify payment
router.post('/verify', 
  paymentLimiter,
  validateRequest({
    body: z.object({
      razorpay_order_id: z.string().min(1, 'Order ID is required'),
      razorpay_payment_id: z.string().min(1, 'Payment ID is required'),
      razorpay_signature: z.string().min(1, 'Signature is required'),
      payment_method: z.enum(['CARD', 'UPI', 'NETBANKING', 'WALLET', 'EMI']).optional(),
    })
  }),
  verifyPayment
);

// Handle payment failure
router.post('/failure', 
  paymentLimiter,
  validateRequest({
    body: z.object({
      order_id: z.string().min(1, 'Order ID is required'),
      payment_id: z.string().optional(),
      error_code: z.string().optional(),
      error_description: z.string().optional(),
    })
  }),
  handlePaymentFailure
);

// Get payment order status
router.get('/orders/:orderId/status', 
  apiLimiter,
  validateRequest({
    params: z.object({
      orderId: z.string().min(1, 'Order ID is required'),
    })
  }),
  getOrderStatus
);

// Get transaction history
router.get('/transactions', 
  apiLimiter,
  validateRequest({
    query: z.object({
      type: z.enum(['buyer', 'seller']).optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
    })
  }),
  getTransactionHistory
);

// Get payment analytics (Sellers and Admins only)
router.get('/analytics', 
  apiLimiter,
  getPaymentAnalytics
);

// Admin-only routes
router.use(adminOnly);

// Initiate refund (Admin only)
router.post('/refund', 
  apiLimiter,
  validateRequest({
    body: z.object({
      transactionId: z.string().min(1, 'Transaction ID is required'),
      amount: z.number().positive().optional(),
      reason: z.string().optional(),
    })
  }),
  refundPayment
);

// Get all transactions (Admin only)
router.get('/admin/transactions', 
  apiLimiter,
  validateRequest({
    query: z.object({
      status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED']).optional(),
      type: z.enum(['PURCHASE', 'REFUND', 'COMMISSION']).optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
  }),
  async (req, res) => {
    try {
      // TODO: Implement admin transaction listing
      const mockTransactions = {
        transactions: [
          {
            id: 'txn_1',
            amount: 2999,
            status: 'COMPLETED',
            type: 'PURCHASE',
            projectTitle: 'React Dashboard',
            buyerName: 'John Doe',
            sellerName: 'Jane Smith',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'txn_2',
            amount: 1999,
            status: 'PENDING',
            type: 'PURCHASE',
            projectTitle: 'Vue Portfolio',
            buyerName: 'Bob Wilson',
            sellerName: 'Alice Brown',
            createdAt: new Date().toISOString(),
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      };

      res.status(200).json({
        success: true,
        message: 'Admin transactions retrieved successfully',
        data: mockTransactions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve admin transactions',
      });
    }
  }
);

// Get payment statistics (Admin only)
router.get('/admin/statistics', 
  apiLimiter,
  async (req, res) => {
    try {
      // TODO: Implement actual statistics calculation
      const mockStats = {
        totalRevenue: 125000,
        totalTransactions: 250,
        successfulTransactions: 235,
        failedTransactions: 15,
        platformCommission: 12500,
        averageOrderValue: 2500,
        monthlyGrowth: 15.5,
        topSellingProjects: [
          { title: 'React E-commerce', sales: 25, revenue: 74750 },
          { title: 'Vue Dashboard', sales: 18, revenue: 35820 },
          { title: 'Angular CRM', sales: 12, revenue: 41880 },
        ],
        paymentMethodDistribution: {
          UPI: 45,
          CARD: 35,
          NETBANKING: 15,
          WALLET: 5,
        },
        dailyTransactions: [
          { date: '2024-01-01', count: 12, amount: 30000 },
          { date: '2024-01-02', count: 15, amount: 37500 },
          { date: '2024-01-03', count: 8, amount: 20000 },
        ],
      };

      res.status(200).json({
        success: true,
        message: 'Payment statistics retrieved successfully',
        data: { statistics: mockStats },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve payment statistics',
      });
    }
  }
);

// Export transaction data (Admin only)
router.get('/admin/export', 
  apiLimiter,
  validateRequest({
    query: z.object({
      format: z.enum(['csv', 'excel']).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED']).optional(),
    })
  }),
  async (req, res) => {
    try {
      const { format = 'csv', startDate, endDate, status } = req.query;

      // TODO: Implement actual export functionality
      const mockCsvData = `Transaction ID,Amount,Status,Type,Project,Buyer,Seller,Date
txn_1,2999,COMPLETED,PURCHASE,React Dashboard,John Doe,Jane Smith,2024-01-01
txn_2,1999,PENDING,PURCHASE,Vue Portfolio,Bob Wilson,Alice Brown,2024-01-02`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=transactions_${Date.now()}.csv`);
      res.status(200).send(mockCsvData);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to export transaction data',
      });
    }
  }
);

export default router;
