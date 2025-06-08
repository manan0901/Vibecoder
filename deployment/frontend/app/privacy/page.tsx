import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | VibeCoder - Vibecoding Marketplace',
  description: 'VibeCoder\'s Privacy Policy explains how we collect, use, and protect your personal information on our vibecoding marketplace platform.',
  keywords: 'vibecoder privacy policy, vibecoding marketplace privacy, data protection, personal information, coding marketplace privacy',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-purple-100">
            Last updated: December 2024
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you register for VibeCoder, we collect:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Name and email address</li>
              <li>Profile information and bio</li>
              <li>Payment information (processed securely by Stripe)</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage Information</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Pages visited and features used</li>
              <li>Search queries and browsing behavior</li>
              <li>Device information and IP address</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Provide and improve our vibecoding marketplace services</li>
              <li>Process transactions and payments</li>
              <li>Send important updates and notifications</li>
              <li>Personalize your experience and recommendations</li>
              <li>Prevent fraud and ensure platform security</li>
              <li>Comply with legal obligations</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell your personal information. We may share information in these situations:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>With Service Providers:</strong> Payment processors, email services, analytics providers</li>
              <li><strong>For Legal Compliance:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
              <li><strong>With Consent:</strong> When you explicitly agree to sharing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>SSL encryption for all data transmission</li>
              <li>Secure payment processing through Stripe</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Data backup and recovery procedures</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Provide personalized content and recommendations</li>
              <li>Improve our services and user experience</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Update:</strong> Correct or update your information</li>
              <li><strong>Delete:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Export your data in a readable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Object:</strong> Object to certain processing activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your information for as long as necessary to provide our services and comply with legal obligations. Account information is typically retained for 7 years after account closure for legal and business purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              VibeCoder operates globally. Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              VibeCoder is not intended for users under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware of such collection, we will delete the information immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our platform integrates with third-party services:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Stripe:</strong> Payment processing (subject to Stripe's privacy policy)</li>
              <li><strong>Google Analytics:</strong> Website analytics and insights</li>
              <li><strong>Email Services:</strong> Transactional and marketing emails</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Updates to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes via email or platform notification. Your continued use of VibeCoder after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about this Privacy Policy or want to exercise your rights, contact us:
            </p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@vibecoder.com<br />
                <strong>Data Protection Officer:</strong> dpo@vibecoder.com<br />
                <strong>Address:</strong> VibeCoder Privacy Team<br />
                <strong>Response Time:</strong> Within 30 days
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
