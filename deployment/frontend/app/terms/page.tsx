import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | VibeCoder - Vibecoding Marketplace',
  description: 'Read VibeCoder\'s Terms of Service for our vibecoding marketplace. Understand the rules and guidelines for buying and selling coding projects and digital services.',
  keywords: 'vibecoder terms of service, vibecoding marketplace terms, coding marketplace rules, digital services terms, programming marketplace guidelines',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-indigo-100">
            Last updated: December 2024
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing and using VibeCoder marketplace ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              VibeCoder is a marketplace platform that connects vibecoding professionals, developers, and buyers of digital coding projects and services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Definitions</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>"VibeCoder"</strong> refers to our vibecoding marketplace platform</li>
              <li><strong>"Seller"</strong> refers to users who offer coding projects and services</li>
              <li><strong>"Buyer"</strong> refers to users who purchase coding projects and services</li>
              <li><strong>"Vibecoding"</strong> refers to premium coding services and projects</li>
              <li><strong>"Digital Products"</strong> refers to downloadable coding projects, templates, and tools</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To access certain features of VibeCoder, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain the security of your password and account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Be responsible for all activities that occur under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Marketplace Rules</h2>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">For Sellers:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>All coding projects must be original or properly licensed</li>
              <li>Provide accurate descriptions and documentation</li>
              <li>Deliver projects as described and within agreed timeframes</li>
              <li>Maintain professional communication with buyers</li>
              <li>Not engage in fraudulent or misleading practices</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">For Buyers:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Use purchased projects in accordance with provided licenses</li>
              <li>Provide clear requirements and feedback</li>
              <li>Make payments promptly for completed work</li>
              <li>Not request illegal or harmful content</li>
              <li>Respect intellectual property rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              VibeCoder uses secure payment processing through Stripe. By making a purchase, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Pay all fees and charges associated with your purchases</li>
              <li>Provide accurate payment information</li>
              <li>Accept our refund policy as outlined separately</li>
              <li>Understand that VibeCoder takes a commission from each transaction</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Sellers retain ownership of their original work but grant buyers appropriate usage rights as specified in individual project licenses. VibeCoder respects intellectual property rights and expects all users to do the same.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Prohibited Activities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You may not:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Upload malicious code or viruses</li>
              <li>Engage in fraudulent activities</li>
              <li>Harass or abuse other users</li>
              <li>Attempt to circumvent our payment system</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              VibeCoder acts as a marketplace platform. We are not responsible for the quality, legality, or accuracy of projects listed by sellers. Our liability is limited to the maximum extent permitted by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to terminate or suspend accounts that violate these terms. Users may also terminate their accounts at any time by contacting our support team.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these terms from time to time. Users will be notified of significant changes via email or platform notifications.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@vibecoder.com<br />
                <strong>Address:</strong> VibeCoder Legal Department<br />
                <strong>Response Time:</strong> Within 48 hours
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
