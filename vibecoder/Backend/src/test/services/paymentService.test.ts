import { createPaymentIntent, confirmPayment, handleWebhook } from '../../services/paymentService';

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn(),
      confirm: jest.fn(),
      retrieve: jest.fn(),
    },
    customers: {
      create: jest.fn(),
      retrieve: jest.fn(),
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  }));
});

describe('Payment Service', () => {
  let mockStripe: any;

  beforeEach(() => {
    const Stripe = require('stripe');
    mockStripe = new Stripe();
  });

  describe('createPaymentIntent', () => {
    it('should create payment intent successfully', async () => {
      const paymentData = {
        amount: 2999,
        currency: 'inr',
        projectId: 'test-project-id',
        buyerId: 'test-buyer-id',
        sellerId: 'test-seller-id',
      };

      const mockPaymentIntent = {
        id: 'pi_test_123',
        client_secret: 'pi_test_123_secret',
        status: 'requires_payment_method',
        amount: 2999,
        currency: 'inr',
      };

      mockStripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent);

      const result = await createPaymentIntent(paymentData);

      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: 2999,
        currency: 'inr',
        metadata: {
          projectId: 'test-project-id',
          buyerId: 'test-buyer-id',
          sellerId: 'test-seller-id',
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      expect(result).toEqual(mockPaymentIntent);
    });

    it('should handle payment intent creation failure', async () => {
      const paymentData = {
        amount: 2999,
        currency: 'inr',
        projectId: 'test-project-id',
        buyerId: 'test-buyer-id',
        sellerId: 'test-seller-id',
      };

      const error = new Error('Payment intent creation failed');
      mockStripe.paymentIntents.create.mockRejectedValue(error);

      await expect(createPaymentIntent(paymentData)).rejects.toThrow('Payment intent creation failed');
    });

    it('should validate payment amount', async () => {
      const invalidPaymentData = {
        amount: -100, // Invalid negative amount
        currency: 'inr',
        projectId: 'test-project-id',
        buyerId: 'test-buyer-id',
        sellerId: 'test-seller-id',
      };

      await expect(createPaymentIntent(invalidPaymentData)).rejects.toThrow();
    });

    it('should validate currency', async () => {
      const invalidPaymentData = {
        amount: 2999,
        currency: 'invalid', // Invalid currency
        projectId: 'test-project-id',
        buyerId: 'test-buyer-id',
        sellerId: 'test-seller-id',
      };

      await expect(createPaymentIntent(invalidPaymentData)).rejects.toThrow();
    });
  });

  describe('confirmPayment', () => {
    it('should confirm payment successfully', async () => {
      const paymentIntentId = 'pi_test_123';
      const paymentMethodId = 'pm_test_123';

      const mockConfirmedPayment = {
        id: 'pi_test_123',
        status: 'succeeded',
        amount: 2999,
        currency: 'inr',
      };

      mockStripe.paymentIntents.confirm.mockResolvedValue(mockConfirmedPayment);

      const result = await confirmPayment(paymentIntentId, paymentMethodId);

      expect(mockStripe.paymentIntents.confirm).toHaveBeenCalledWith(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      expect(result).toEqual(mockConfirmedPayment);
    });

    it('should handle payment confirmation failure', async () => {
      const paymentIntentId = 'pi_test_123';
      const paymentMethodId = 'pm_test_123';

      const error = new Error('Payment confirmation failed');
      mockStripe.paymentIntents.confirm.mockRejectedValue(error);

      await expect(confirmPayment(paymentIntentId, paymentMethodId)).rejects.toThrow('Payment confirmation failed');
    });

    it('should handle insufficient funds', async () => {
      const paymentIntentId = 'pi_test_123';
      const paymentMethodId = 'pm_test_123';

      const mockFailedPayment = {
        id: 'pi_test_123',
        status: 'requires_payment_method',
        last_payment_error: {
          code: 'card_declined',
          decline_code: 'insufficient_funds',
        },
      };

      mockStripe.paymentIntents.confirm.mockResolvedValue(mockFailedPayment);

      const result = await confirmPayment(paymentIntentId, paymentMethodId);

      expect(result.status).toBe('requires_payment_method');
      expect(result.last_payment_error.decline_code).toBe('insufficient_funds');
    });
  });

  describe('handleWebhook', () => {
    it('should handle payment_intent.succeeded webhook', async () => {
      const webhookPayload = JSON.stringify({
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_123',
            status: 'succeeded',
            amount: 2999,
            metadata: {
              projectId: 'test-project-id',
              buyerId: 'test-buyer-id',
              sellerId: 'test-seller-id',
            },
          },
        },
      });

      const webhookSignature = 'test_signature';
      const webhookSecret = 'whsec_test_secret';

      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_123',
            status: 'succeeded',
            amount: 2999,
            metadata: {
              projectId: 'test-project-id',
              buyerId: 'test-buyer-id',
              sellerId: 'test-seller-id',
            },
          },
        },
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

      const result = await handleWebhook(webhookPayload, webhookSignature, webhookSecret);

      expect(mockStripe.webhooks.constructEvent).toHaveBeenCalledWith(
        webhookPayload,
        webhookSignature,
        webhookSecret
      );

      expect(result).toEqual({
        success: true,
        eventType: 'payment_intent.succeeded',
        processed: true,
      });
    });

    it('should handle payment_intent.payment_failed webhook', async () => {
      const webhookPayload = JSON.stringify({
        type: 'payment_intent.payment_failed',
        data: {
          object: {
            id: 'pi_test_123',
            status: 'requires_payment_method',
            last_payment_error: {
              code: 'card_declined',
            },
          },
        },
      });

      const webhookSignature = 'test_signature';
      const webhookSecret = 'whsec_test_secret';

      const mockEvent = {
        type: 'payment_intent.payment_failed',
        data: {
          object: {
            id: 'pi_test_123',
            status: 'requires_payment_method',
            last_payment_error: {
              code: 'card_declined',
            },
          },
        },
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

      const result = await handleWebhook(webhookPayload, webhookSignature, webhookSecret);

      expect(result).toEqual({
        success: true,
        eventType: 'payment_intent.payment_failed',
        processed: true,
      });
    });

    it('should handle invalid webhook signature', async () => {
      const webhookPayload = 'invalid_payload';
      const webhookSignature = 'invalid_signature';
      const webhookSecret = 'whsec_test_secret';

      const error = new Error('Invalid signature');
      mockStripe.webhooks.constructEvent.mockImplementation(() => {
        throw error;
      });

      await expect(handleWebhook(webhookPayload, webhookSignature, webhookSecret)).rejects.toThrow('Invalid signature');
    });

    it('should handle unknown webhook events', async () => {
      const webhookPayload = JSON.stringify({
        type: 'unknown.event',
        data: {
          object: {},
        },
      });

      const webhookSignature = 'test_signature';
      const webhookSecret = 'whsec_test_secret';

      const mockEvent = {
        type: 'unknown.event',
        data: {
          object: {},
        },
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

      const result = await handleWebhook(webhookPayload, webhookSignature, webhookSecret);

      expect(result).toEqual({
        success: true,
        eventType: 'unknown.event',
        processed: false,
      });
    });
  });

  describe('Payment Validation', () => {
    it('should validate payment amount range', () => {
      const validAmounts = [50, 100, 1000, 50000, 100000]; // Valid amounts in paise
      const invalidAmounts = [-100, 0, 10, 10000000]; // Invalid amounts

      validAmounts.forEach(amount => {
        expect(() => validatePaymentAmount(amount)).not.toThrow();
      });

      invalidAmounts.forEach(amount => {
        expect(() => validatePaymentAmount(amount)).toThrow();
      });
    });

    it('should validate supported currencies', () => {
      const validCurrencies = ['inr', 'usd', 'eur'];
      const invalidCurrencies = ['xyz', 'abc', ''];

      validCurrencies.forEach(currency => {
        expect(() => validateCurrency(currency)).not.toThrow();
      });

      invalidCurrencies.forEach(currency => {
        expect(() => validateCurrency(currency)).toThrow();
      });
    });
  });
});

// Helper validation functions
function validatePaymentAmount(amount: number): void {
  if (amount < 50) {
    throw new Error('Payment amount must be at least ₹0.50');
  }
  if (amount > 5000000) {
    throw new Error('Payment amount cannot exceed ₹50,000');
  }
}

function validateCurrency(currency: string): void {
  const supportedCurrencies = ['inr', 'usd', 'eur'];
  if (!supportedCurrencies.includes(currency.toLowerCase())) {
    throw new Error(`Currency ${currency} is not supported`);
  }
}
