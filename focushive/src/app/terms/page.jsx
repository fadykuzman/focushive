'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to FocusHive
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using FocusHive, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Use License</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              FocusHive is provided as-is for personal productivity use. You may:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Use the application for personal time management and productivity tracking</li>
              <li>Access all features without creating an account</li>
              <li>Store data locally on your device</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Data and Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              FocusHive operates with a privacy-first approach:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>All data is stored locally in your browser</li>
              <li>No personal information is collected or transmitted to external servers</li>
              <li>No analytics or tracking scripts are used</li>
              <li>You maintain full control over your productivity data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Open Source</h2>
            <p className="text-gray-700 leading-relaxed">
              FocusHive is open source software. You can view, modify, and distribute the source code according to the project's license terms available in the project repository.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed">
              The application is provided "as is" without any warranties, expressed or implied. We do not guarantee uninterrupted service or that the application will be error-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              In no event shall FocusHive or its developers be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be reflected by updating the "Last updated" date above. Continued use of the application constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms of Service, please contact us through the project's GitHub repository.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            By using FocusHive, you acknowledge that you have read and understood these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}