'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '../lib/auth-context';

interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

interface Transaction {
  id: string;
  amount: number;
  status: string;
  projectId: string;
  completedAt?: string;
}

interface PaymentResult {
  success: boolean;
  transaction?: Transaction;
  error?: string;
}

export const usePayment = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentOrder = useCallback(async (
    projectId: string,
    amount: number,
    description?: string
  ): Promise<{ order: PaymentOrder; razorpayKeyId: string } | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId,
          amount,
          description,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment order');
      }

      return {
        order: data.data.order,
        razorpayKeyId: data.data.razorpayKeyId,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create payment order';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const verifyPayment = useCallback(async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    payment_method?: string;
  }): Promise<Transaction | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Payment verification failed');
      }

      return data.data.transaction;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment verification failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const handlePaymentFailure = useCallback(async (
    orderId: string,
    errorCode?: string,
    errorDescription?: string
  ): Promise<void> => {
    if (!user) return;

    try {
      const token = localStorage.getItem('accessToken');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/failure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: orderId,
          error_code: errorCode,
          error_description: errorDescription,
        }),
      });
    } catch (error) {
      console.error('Error handling payment failure:', error);
    }
  }, [user]);

  const getPaymentStatus = useCallback(async (orderId: string): Promise<Transaction | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/orders/${orderId}/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get payment status');
      }

      return data.data.transaction;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get payment status';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getTransactionHistory = useCallback(async (
    type: 'buyer' | 'seller' = 'buyer',
    page: number = 1,
    limit: number = 10
  ): Promise<{
    transactions: Transaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  } | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/transactions?type=${type}&page=${page}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get transaction history');
      }

      return data.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get transaction history';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const processRazorpayPayment = useCallback(async (
    projectId: string,
    amount: number,
    projectTitle: string,
    sellerName: string
  ): Promise<PaymentResult> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      return { success: false, error: 'Payment gateway not loaded' };
    }

    try {
      // Create payment order
      const orderData = await createPaymentOrder(projectId, amount, `Purchase of ${projectTitle}`);
      
      if (!orderData) {
        return { success: false, error: error || 'Failed to create payment order' };
      }

      // Return a promise that resolves when payment is complete
      return new Promise((resolve) => {
        const options = {
          key: orderData.razorpayKeyId,
          amount: orderData.order.amount,
          currency: orderData.order.currency,
          name: 'VibeCoder',
          description: `Purchase of ${projectTitle}`,
          order_id: orderData.order.id,
          prefill: {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
          },
          theme: {
            color: '#2563eb',
          },
          handler: async (response: any) => {
            try {
              const transaction = await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                payment_method: 'CARD',
              });

              if (transaction) {
                resolve({ success: true, transaction });
              } else {
                resolve({ success: false, error: error || 'Payment verification failed' });
              }
            } catch (error) {
              resolve({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Payment verification failed' 
              });
            }
          },
          modal: {
            ondismiss: () => {
              resolve({ success: false, error: 'Payment cancelled by user' });
            },
          },
          notes: {
            project_id: projectId,
            project_title: projectTitle,
            seller_name: sellerName,
          },
        };

        const razorpay = new window.Razorpay(options);

        razorpay.on('payment.failed', async (response: any) => {
          const errorMessage = response.error.description || 'Payment failed';
          await handlePaymentFailure(orderData.order.id, response.error.code, errorMessage);
          resolve({ success: false, error: errorMessage });
        });

        razorpay.open();
      });
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process payment' 
      };
    }
  }, [user, createPaymentOrder, verifyPayment, handlePaymentFailure, error]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    createPaymentOrder,
    verifyPayment,
    handlePaymentFailure,
    getPaymentStatus,
    getTransactionHistory,
    processRazorpayPayment,
    clearError,
  };
};
