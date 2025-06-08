import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | VibeCoder - Vibecoding Marketplace',
  description: 'Learn about how VibeCoder uses cookies and tracking technologies on our vibecoding marketplace to improve your experience.',
  keywords: 'vibecoder cookie policy, vibecoding marketplace cookies, website tracking, data collection, user experience',
};

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-xl text-orange-100">
            Last updated: December 2024
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cookies are small text files that are stored on your device when you visit VibeCoder. They help us provide you with a better experience by remembering your preferences and analyzing how you use our vibecoding marketplace.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                </p>
                <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                  <li>Authentication and login status</li>
                  <li>Shopping cart functionality</li>
                  <li>Security and fraud prevention</li>
                  <li>Load balancing</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                </p>
                <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                  <li>Google Analytics for website traffic analysis</li>
                  <li>Page load times and performance metrics</li>
                  <li>Error tracking and debugging</li>
                  <li>User behavior patterns</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Functional Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
                </p>
                <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                  <li>Language and region preferences</li>
                  <li>Theme and display settings</li>
                  <li>Recently viewed projects</li>
                  <li>Search filters and sorting preferences</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  These cookies track your activity across websites to help advertisers deliver more relevant advertising.
                </p>
                <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                  <li>Personalized content recommendations</li>
                  <li>Social media integration</li>
                  <li>Advertising effectiveness measurement</li>
                  <li>Retargeting campaigns</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We also use third-party services that may set cookies on your device:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Google Analytics</h4>
                <p className="text-sm text-gray-600">Helps us understand website usage and improve user experience.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Stripe</h4>
                <p className="text-sm text-gray-600">Secure payment processing and fraud prevention.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Social Media</h4>
                <p className="text-sm text-gray-600">Social sharing buttons and embedded content.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Email Services</h4>
                <p className="text-sm text-gray-600">Newsletter tracking and email campaign analytics.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Your Cookie Preferences</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Browser Settings</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You can control and manage cookies through your browser settings. Here's how to do it in popular browsers:
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900 w-20">Chrome:</span>
                <span className="text-gray-700">Settings → Privacy and security → Cookies and other site data</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900 w-20">Firefox:</span>
                <span className="text-gray-700">Options → Privacy & Security → Cookies and Site Data</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900 w-20">Safari:</span>
                <span className="text-gray-700">Preferences → Privacy → Manage Website Data</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900 w-20">Edge:</span>
                <span className="text-gray-700">Settings → Cookies and site permissions → Cookies and site data</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Cookie Consent</h3>
            <p className="text-gray-700 leading-relaxed">
              When you first visit VibeCoder, you'll see a cookie consent banner. You can choose to accept all cookies or customize your preferences. You can change these settings at any time through our cookie preference center.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Impact of Disabling Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you choose to disable cookies, some features of VibeCoder may not work properly:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>You may need to log in repeatedly</li>
              <li>Your preferences and settings won't be saved</li>
              <li>Some personalized features may not work</li>
              <li>Shopping cart functionality may be limited</li>
              <li>We won't be able to remember your language preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about our use of cookies, please contact us:
            </p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@vibecoder.com<br />
                <strong>Subject:</strong> Cookie Policy Inquiry<br />
                <strong>Response Time:</strong> Within 48 hours
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
