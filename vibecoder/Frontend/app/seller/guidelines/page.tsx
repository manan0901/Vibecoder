'use client';

import { Navbar } from '../../../components/ui/navbar';
import { Footer } from '../../../components/ui/footer';

export default function SellerGuidelinesPage() {
  const guidelines = [
    {
      title: 'Code Quality Standards',
      items: [
        'Write clean, well-documented code',
        'Follow industry best practices',
        'Include comprehensive README files',
        'Provide setup and installation instructions',
        'Test your code thoroughly before submission'
      ]
    },
    {
      title: 'Project Requirements',
      items: [
        'Original work only - no plagiarism',
        'Complete, functional projects',
        'Include all necessary dependencies',
        'Provide clear project descriptions',
        'Add relevant tags and categories'
      ]
    },
    {
      title: 'Pricing Guidelines',
      items: [
        'Price fairly based on complexity and value',
        'Consider market rates for similar projects',
        'Offer different licensing options when appropriate',
        'Be transparent about what\'s included',
        'Update prices based on market feedback'
      ]
    },
    {
      title: 'Communication Standards',
      items: [
        'Respond to buyer inquiries promptly',
        'Provide excellent customer support',
        'Be professional in all interactions',
        'Handle disputes fairly and constructively',
        'Maintain positive seller reputation'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Seller Guidelines</h1>
            <p className="mt-2 text-gray-600">
              Follow these guidelines to become a successful seller on VibeCoder
            </p>
          </div>

          <div className="space-y-8">
            {guidelines.map((section, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {section.title}
                </h2>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className="text-vibecoder-600 mr-2">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-vibecoder-50 rounded-lg">
            <h3 className="text-lg font-semibold text-vibecoder-900 mb-2">
              Need Help?
            </h3>
            <p className="text-vibecoder-700 mb-4">
              If you have questions about these guidelines or need assistance, don't hesitate to reach out.
            </p>
            <a
              href="/contact"
              className="btn btn-primary"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
