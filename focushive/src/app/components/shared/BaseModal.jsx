"use client";

import { useRef, useEffect } from 'react';

const BaseModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  className = '',
  contentClassName = '',
  id = 'modal'
}) => {
  const modalRef = useRef(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Size variants
  const sizeClasses = {
    sm: 'w-[360px] max-w-[90vw]',
    md: 'w-[480px] max-w-[90vw]',
    lg: 'w-[640px] max-w-[90vw]',
    xl: 'max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-auto w-full',
    auto: 'max-w-md w-full'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div 
      id={`${id}-overlay`}
      className={`fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 ${className}`}
      onClick={handleOverlayClick}
    >
      <div 
        ref={modalRef}
        id={`${id}-content`}
        data-testid={id}
        className={`bg-white rounded-lg p-4 sm:p-6 shadow-xl ${sizeClass} ${contentClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            {title && (
              <h2 
                id={`${id}-title`}
                className="text-heading-h2 text-gray-800"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                id={`${id}-close-button`}
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <img src="/icons/close.svg" alt="Close" className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default BaseModal;