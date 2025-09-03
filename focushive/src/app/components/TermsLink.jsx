'use client';

import Link from 'next/link';

export default function TermsLink({ className = "" }) {
  return (
    <Link
      href="/terms"
      className={`w-8 h-8 opacity-70 hover:opacity-100 transition-opacity ${className}`}
      title="Terms of Service"
    >
      <img 
        src="/icons/terms.svg" 
        alt="Terms of Service" 
        className="w-6 h-6"
        style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }}
      />
    </Link>
  );
}