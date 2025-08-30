'use client';

import { useState, useEffect } from 'react';

export default function TestReports() {
  const [reportExists, setReportExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/reports/index.html')
      .then(response => {
        setReportExists(response.ok);
        setLoading(false);
      })
      .catch(() => {
        setReportExists(false);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading Test Reports...</h1>
        </div>
      </div>
    );
  }

  if (!reportExists) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Reports Not Available</h1>
          <p className="text-gray-600 mb-6">
            Test reports haven't been generated yet. Run the following command to generate them:
          </p>
          <code className="bg-gray-100 px-4 py-2 rounded text-sm">
            npm run test:report
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <iframe 
        src="/reports/index.html"
        className="w-full h-screen border-0"
        title="Test Reports"
      />
    </div>
  );
}