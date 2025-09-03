'use client';

import Link from 'next/link';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to FocusHive
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Privacy Notice</h1>
            <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Privacy Matters</h2>
            <p className="text-gray-700 mb-6">
              FocusHive is designed with privacy in mind. This notice explains how we handle your data and protect your privacy while using our Pomodoro timer application.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Storage</h3>
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <p className="text-green-800">
                <strong>Local Storage Only:</strong> All your timer settings, tasks, notes, and session history are stored locally in your browser. No data is transmitted to external servers.
              </p>
            </div>
            
            <ul className="text-gray-700 mb-6 list-disc pl-6 space-y-2">
              <li>Timer preferences (focus/break durations, rounds)</li>
              <li>Task list and task completion status</li>
              <li>Session notes and timer history</li>
              <li>Application settings and configurations</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">No Data Collection</h3>
            <p className="text-gray-700 mb-6">
              FocusHive does not collect, store, or transmit any personal information to external servers. We do not use:
            </p>
            <ul className="text-gray-700 mb-6 list-disc pl-6 space-y-2">
              <li>Analytics or tracking services</li>
              <li>Third-party cookies</li>
              <li>User accounts or authentication</li>
              <li>External data storage or cloud services</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Browser Storage</h3>
            <p className="text-gray-700 mb-6">
              FocusHive uses your browser's local storage capabilities (LocalStorage and IndexedDB) to save your data locally on your device. This means:
            </p>
            <ul className="text-gray-700 mb-6 list-disc pl-6 space-y-2">
              <li>Your data remains on your device at all times</li>
              <li>Data is not accessible to other websites</li>
              <li>You can clear this data anytime through your browser settings</li>
              <li>Data is not backed up - clearing browser data will remove all timer history</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Open Source</h3>
            <p className="text-gray-700 mb-6">
              FocusHive is open source software. You can review our code, verify our privacy claims, and even run your own version of the application. This transparency ensures you can trust how your data is handled.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact</h3>
            <p className="text-gray-700 mb-6">
              If you have any questions about this privacy notice or FocusHive's data handling practices, please contact us through our GitHub repository or project documentation.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-blue-800">
                <strong>Summary:</strong> FocusHive respects your privacy by keeping all data local to your browser. No external servers, no tracking, no data collection - just a simple, private productivity tool.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}