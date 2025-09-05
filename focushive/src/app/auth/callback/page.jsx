'use client';

import { useEffect, useState } from 'react';
import { googleAuth } from '@/app/utils/googleAuth';
import { googleCalendar } from '@/app/services/googleCalendar';

export default function AuthCallback() {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus('processing');
        
        // Handle the OAuth callback
        const result = await googleAuth.handleCallback();
        
        if (result.success) {
          setUser(result.user);
          setStatus('testing_calendar');
          
          // Test calendar connection
          const calendarTest = await googleCalendar.testConnection();
          
          if (calendarTest.success) {
            setStatus('success');
            
            // Redirect back to the app after a short delay
            setTimeout(() => {
              // Remove callback params and redirect to timer
              const baseUrl = window.location.origin;
              window.location.href = `${baseUrl}/?calendar_connected=true`;
            }, 2000);
          } else {
            throw new Error('Calendar connection failed: ' + calendarTest.error);
          }
        }
      } catch (err) {
        console.error('Auth callback failed:', err);
        setError(err.message);
        setStatus('error');
        
        // Redirect back to app with error after delay
        setTimeout(() => {
          const baseUrl = window.location.origin;
          window.location.href = `${baseUrl}/?calendar_error=${encodeURIComponent(err.message)}`;
        }, 3000);
      }
    };

    // Only run callback handling if we have the right parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('code') || urlParams.has('error')) {
      handleCallback();
    } else {
      setError('Invalid callback - missing required parameters');
      setStatus('error');
    }
  }, []);

  const getStatusMessage = () => {
    switch (status) {
      case 'processing':
        return {
          icon: '⏳',
          title: 'Connecting to Google...',
          message: 'Please wait while we complete the authentication process.'
        };
      case 'testing_calendar':
        return {
          icon: '📅',
          title: 'Testing Calendar Access...',
          message: 'Verifying your calendar permissions.'
        };
      case 'success':
        return {
          icon: '✅',
          title: 'Successfully Connected!',
          message: `Welcome, ${user?.name}! Redirecting you back to FocusHive...`
        };
      case 'error':
        return {
          icon: '❌',
          title: 'Connection Failed',
          message: error || 'An unexpected error occurred during authentication.'
        };
      default:
        return {
          icon: '⏳',
          title: 'Processing...',
          message: 'Please wait.'
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">{statusInfo.icon}</div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {statusInfo.title}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {statusInfo.message}
        </p>
        
        {status === 'processing' && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {status === 'success' && user && (
          <div className="bg-green-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center space-x-3">
              {user.picture && (
                <img 
                  src={user.picture} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div className="text-left">
                <p className="font-medium text-green-800">{user.name}</p>
                <p className="text-sm text-green-600">{user.email}</p>
              </div>
            </div>
          </div>
        )}
        
        {status === 'error' && (
          <div className="bg-red-50 rounded-lg p-4 mb-4">
            <p className="text-red-800 text-sm">
              {error}
            </p>
            <button
              onClick={() => window.location.href = window.location.origin}
              className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Return to FocusHive
            </button>
          </div>
        )}
        
        <div className="text-xs text-gray-400 mt-6">
          Powered by Google OAuth 2.0 with PKCE
        </div>
      </div>
    </div>
  );
}