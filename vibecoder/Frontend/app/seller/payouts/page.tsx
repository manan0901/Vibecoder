'use client';

import { Navbar } from '../../../components/ui/navbar';
import { Footer } from '../../../components/ui/footer';

export default function SellerPayoutsPage() {
  const payoutMethods = [
    {
      name: 'Bank Transfer',
      description: 'Direct transfer to your bank account',
      processingTime: '1-3 business days',
      fees: 'Free',
      icon: '🏦'
    },
    {
      name: 'UPI',
      description: 'Instant transfer via UPI',
      processingTime: 'Instant',
      fees: 'Free',
      icon: '📱'
    },
    {
      name: 'PayPal',
      description: 'Transfer to your PayPal account',
      processingTime: '1-2 business days',
      fees: '2.9% + ₹30',
      icon: '💳'
    }
  ];

  const faqItems = [
    {
      question: 'When do I get paid?',
      answer: 'Payments are processed automatically when a buyer purchases your project. You can request a payout anytime your balance reaches ₹500 or more.'
    },
    {
      question: 'What are the payout fees?',
      answer: 'Bank transfers and UPI are free. PayPal charges 2.9% + ₹30 per transaction. We cover all other processing fees.'
    },
    {
      question: 'How long do payouts take?',
      answer: 'UPI transfers are instant. Bank transfers take 1-3 business days. PayPal transfers take 1-2 business days.'
    },
    {
      question: 'What is the minimum payout amount?',
      answer: 'The minimum payout amount is ₹500. This helps reduce transaction costs and processing overhead.'
    },
    {
      question: 'Can I change my payout method?',
      answer: 'Yes, you can update your payout method anytime in your seller dashboard under payment settings.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Payout Information</h1>
            <p className="mt-2 text-gray-600">
              Learn about our payout methods, fees, and processing times
            </p>
          </div>

          {/* Payout Methods */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Available Payout Methods</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {payoutMethods.map((method, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4">{method.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {method.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{method.description}</p>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Processing Time:</span>
                        <span className="text-gray-600 ml-1">{method.processingTime}</span>
                      </div>
                      <div>
                        <span className="font-medium">Fees:</span>
                        <span className="text-gray-600 ml-1">{method.fees}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commission Structure */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Commission Structure</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Platform Fee</h3>
                  <p className="text-gray-600 mb-4">
                    We charge a 15% platform fee on each sale. This covers payment processing, 
                    hosting, marketing, and customer support.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">You Keep</h3>
                  <p className="text-gray-600 mb-4">
                    You keep 85% of every sale. For example, if you sell a project for ₹1,000, 
                    you earn ₹850.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.question}
                  </h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center p-6 bg-vibecoder-50 rounded-lg">
            <h3 className="text-lg font-semibold text-vibecoder-900 mb-2">
              Ready to Start Earning?
            </h3>
            <p className="text-vibecoder-700 mb-4">
              Set up your seller account and start earning money from your coding projects today.
            </p>
            <a
              href="/seller/register"
              className="btn btn-primary"
            >
              Become a Seller
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
