'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    title: string;
    price: number;
    seller: {
      firstName: string;
      lastName: string;
    };
  };
  onSuccess: (transactionId: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentModal({ isOpen, onClose, project, onSuccess }: PaymentModalProps) {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const loadRazorpay = () => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => setError('Failed to load payment gateway');
      document.body.appendChild(script);
    };

    if (isOpen) {
      loadRazorpay();
    }
  }, [isOpen]);

  const createPaymentOrder = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId: project.id,
          amount: project.price,
          description: `Purchase of ${project.title}`,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment order');
      }

      return data.data;
    } catch (error) {
      console.error('Error creating payment order:', error);
      throw error;
    }
  };

  const verifyPayment = async (paymentData: any) => {
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

      return data.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  };

  const handlePaymentFailure = async (orderId: string, errorData: any) => {
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
          error_code: errorData.code,
          error_description: errorData.description,
        }),
      });
    } catch (error) {
      console.error('Error handling payment failure:', error);
    }
  };

  const initiatePayment = async () => {
    if (!user) {
      setError('Please login to make a purchase');
      return;
    }

    if (!razorpayLoaded) {
      setError('Payment gateway not loaded. Please try again.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Create payment order
      const orderData = await createPaymentOrder();

      const options = {
        key: orderData.razorpayKeyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'VibeCoder',
        description: `Purchase of ${project.title}`,
        order_id: orderData.order.id,
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
        handler: async (response: any) => {
          try {
            // Verify payment
            const verificationData = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              payment_method: 'CARD', // This would be detected from Razorpay response
            });

            setIsProcessing(false);
            onSuccess(verificationData.transaction.id);
            onClose();
          } catch (error) {
            setIsProcessing(false);
            setError(error instanceof Error ? error.message : 'Payment verification failed');
          }
        },
        notes: {
          project_id: project.id,
          project_title: project.title,
          seller_name: `${project.seller.firstName} ${project.seller.lastName}`,
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', async (response: any) => {
        setIsProcessing(false);
        const errorMessage = response.error.description || 'Payment failed';
        setError(errorMessage);
        
        // Log payment failure
        await handlePaymentFailure(orderData.order.id, response.error);
      });

      razorpay.open();
    } catch (error) {
      setIsProcessing(false);
      setError(error instanceof Error ? error.message : 'Failed to initiate payment');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Complete Purchase</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isProcessing}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Project Details */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
          <p className="text-sm text-gray-600 mb-3">
            by {project.seller.firstName} {project.seller.lastName}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Price:</span>
            <span className="text-xl font-bold text-blue-600">₹{project.price.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Information */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">What you'll get:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Complete source code
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Documentation and setup guide
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Lifetime access and updates
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Commercial usage rights
            </li>
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Payment Methods */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Accepted Payment Methods:</h4>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <span className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center mr-1">💳</span>
              Cards
            </span>
            <span className="flex items-center">
              <span className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center mr-1">📱</span>
              UPI
            </span>
            <span className="flex items-center">
              <span className="w-8 h-5 bg-purple-600 rounded text-white text-xs flex items-center justify-center mr-1">🏦</span>
              Banking
            </span>
            <span className="flex items-center">
              <span className="w-8 h-5 bg-orange-600 rounded text-white text-xs flex items-center justify-center mr-1">💰</span>
              Wallets
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 btn btn-outline py-3"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={initiatePayment}
            disabled={isProcessing || !razorpayLoaded}
            className="flex-1 btn btn-primary py-3"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : !razorpayLoaded ? (
              'Loading...'
            ) : (
              `Pay ₹${project.price.toLocaleString()}`
            )}
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>🔒 Your payment is secured by Razorpay</p>
          <p>All transactions are encrypted and secure</p>
        </div>
      </div>
    </div>
  );
}
