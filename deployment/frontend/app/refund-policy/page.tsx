import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy | VibeCoder - Vibecoding Marketplace',
  description: 'VibeCoder\'s refund policy for vibecoding services and digital products. Learn about our money-back guarantee and refund process.',
  keywords: 'vibecoder refund policy, vibecoding marketplace refunds, money back guarantee, digital product refunds, coding project refunds',
};

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
          <p className="text-xl text-green-100">
            Last updated: December 2024
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to You</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At VibeCoder, we stand behind the quality of our vibecoding marketplace and the projects offered by our sellers. We want you to be completely satisfied with your purchase. This refund policy outlines the circumstances under which refunds are available.
            </p>
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <p className="text-green-800 font-medium">
                💰 Money-Back Guarantee: We offer a 30-day satisfaction guarantee on all digital products and services.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Eligibility</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">You are eligible for a refund if:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>The project or service does not match the description provided</li>
              <li>The delivered work contains significant bugs or errors that prevent functionality</li>
              <li>The seller fails to deliver within the agreed timeframe without valid reason</li>
              <li>The project violates intellectual property rights</li>
              <li>The seller becomes unresponsive after payment</li>
              <li>Technical issues prevent you from accessing your purchase</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Refunds are NOT available for:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Change of mind after successful delivery</li>
              <li>Buyer's failure to provide clear requirements</li>
              <li>Compatibility issues with buyer's specific setup (unless specified)</li>
              <li>Minor cosmetic preferences or subjective design choices</li>
              <li>Projects downloaded and used beyond the trial period</li>
              <li>Custom work that meets the agreed specifications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Process</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Contact Support</h4>
                  <p className="text-gray-700 text-sm">Email us at refunds@vibecoder.com with your order details and reason for refund request.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Review Process</h4>
                  <p className="text-gray-700 text-sm">Our team will review your request within 48 hours and may contact you for additional information.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Resolution</h4>
                  <p className="text-gray-700 text-sm">If approved, refunds are processed within 5-7 business days to your original payment method.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Refunds</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-green-600">Full Refund</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Project not delivered</li>
                  <li>• Major functionality issues</li>
                  <li>• Seller misconduct</li>
                  <li>• Copyright violations</li>
                </ul>
              </div>
              
              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-orange-600">Partial Refund</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Minor issues that can be fixed</li>
                  <li>• Delayed delivery</li>
                  <li>• Incomplete deliverables</li>
                  <li>• Quality below expectations</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dispute Resolution</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Before requesting a refund, we encourage buyers and sellers to communicate and resolve issues directly. Our support team is available to mediate disputes and find mutually acceptable solutions.
            </p>
            
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Dispute Resolution Steps:</h4>
              <ol className="list-decimal list-inside text-blue-800 space-y-1 text-sm">
                <li>Direct communication between buyer and seller</li>
                <li>VibeCoder mediation if needed</li>
                <li>Formal refund request if resolution fails</li>
                <li>Final decision by VibeCoder support team</li>
              </ol>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Seller Protection</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We also protect our sellers from fraudulent refund requests:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Sellers have the right to respond to refund requests</li>
              <li>Evidence of delivery and communication is considered</li>
              <li>Sellers are protected against unreasonable demands</li>
              <li>Clear project specifications help prevent disputes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Times</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Initial Review:</span>
                <span className="text-gray-700">24-48 hours</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Investigation:</span>
                <span className="text-gray-700">2-5 business days</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Refund Processing:</span>
                <span className="text-gray-700">5-7 business days</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Bank Processing:</span>
                <span className="text-gray-700">3-10 business days</span>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Special Circumstances</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Subscription Services</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              For subscription-based services, refunds are prorated based on unused time. Cancellations take effect at the end of the current billing period.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Promotional Purchases</h3>
            <p className="text-gray-700 leading-relaxed">
              Items purchased during promotional periods or with discount codes are subject to the same refund policy, but refunds will be processed for the amount actually paid.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For refund requests or questions about this policy:
            </p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> refunds@vibecoder.com<br />
                <strong>Subject Line:</strong> Refund Request - Order #[Your Order Number]<br />
                <strong>Support Hours:</strong> Monday-Friday, 9 AM - 6 PM IST<br />
                <strong>Response Time:</strong> Within 24 hours
              </p>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                <strong>💡 Tip:</strong> Include your order number, detailed description of the issue, and any relevant screenshots or files to expedite the review process.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
