'use client';

import Link from 'next/link';

export default function PrivacyLink({ className = "" }) {
  return (
    <Link
      href="/privacy"
      className={`w-8 h-8 opacity-70 hover:opacity-100 transition-opacity ${className}`}
      title="Privacy Notice"
    >
      <img 
        src="/icons/privacy.svg" 
        alt="Privacy Notice" 
        className="w-6 h-6"
        style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }}
      />
    </Link>
  );
}