"use client";

import { getInteractiveTextTheme } from '@/app/utils/themeUtils';

const NumberControl = ({
  value,
  onIncrement,
  onDecrement,
  min = 0,
  max = Infinity,
  isInSidebar = false,
  size = 'md',
  className = '',
  label,
  showValue = true,
  disabled = false,
  id
}) => {
  // Size variants
  const sizeClasses = {
    sm: {
      button: 'w-5 h-5 text-xs',
      value: 'text-xs min-w-[16px]',
      gap: 'gap-1'
    },
    md: {
      button: 'w-6 h-6 text-sm',
      value: 'text-sm min-w-[20px]',
      gap: 'gap-2'
    },
    lg: {
      button: 'w-8 h-8 text-base',
      value: 'text-base min-w-[24px]',
      gap: 'gap-3'
    }
  };

  const sizeConfig = sizeClasses[size] || sizeClasses.md;
  
  // Get theme classes using our theme utilities
  const buttonTheme = getInteractiveTextTheme(isInSidebar, 'secondary');
  const valueTheme = isInSidebar ? 'text-gray-700' : 'text-white';
  
  const buttonClasses = `${sizeConfig.button} rounded flex items-center justify-center transition-colors ${buttonTheme}`;
  
  const handleIncrement = (e) => {
    e.stopPropagation();
    if (!disabled && value < max) {
      onIncrement();
    }
  };
  
  const handleDecrement = (e) => {
    e.stopPropagation();
    if (!disabled && value > min) {
      onDecrement();
    }
  };
  
  const canDecrement = !disabled && value > min;
  const canIncrement = !disabled && value < max;

  return (
    <div className={`flex items-center ${sizeConfig.gap} ${className}`} id={id}>
      {label && (
        <span className={`font-medium ${valueTheme}`}>
          {label}:
        </span>
      )}
      
      <button
        onClick={handleDecrement}
        disabled={!canDecrement}
        className={`${buttonClasses} ${!canDecrement ? 'opacity-30 cursor-not-allowed' : ''}`}
        aria-label="Decrease value"
        type="button"
      >
        −
      </button>
      
      {showValue && (
        <span className={`${sizeConfig.value} text-center font-medium ${valueTheme}`}>
          {value}
        </span>
      )}
      
      <button
        onClick={handleIncrement}
        disabled={!canIncrement}
        className={`${buttonClasses} ${!canIncrement ? 'opacity-30 cursor-not-allowed' : ''}`}
        aria-label="Increase value"
        type="button"
      >
        +
      </button>
    </div>
  );
};

export default NumberControl;