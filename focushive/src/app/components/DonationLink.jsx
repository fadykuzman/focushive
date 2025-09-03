'use client';

export default function DonationLink({ className = "" }) {
  return (
    <a
      href="https://buymeacoffee.com/codefuchs"
      target="_blank"
      rel="noopener noreferrer"
      className={`w-8 h-8 opacity-70 hover:opacity-100 transition-opacity ${className}`}
      title="Buy Me a Coffee"
    >
      <img 
        src="/icons/coffee.svg" 
        alt="Buy Me a Coffee" 
        className="w-6 h-6"
      />
    </a>
  );
}