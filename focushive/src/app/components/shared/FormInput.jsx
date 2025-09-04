"use client";

import { getCustomTheme } from '@/app/utils/themeUtils';

const FormInput = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  id,
  name,
  min,
  max,
  disabled = false,
  autoFocus = false,
  isInSidebar = false,
  variant = 'default',
  size = 'md',
  focusColor = 'blue',
  onKeyDown,
  ...props
}) => {
  // Size variants
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2',
    lg: 'px-4 py-3 text-lg'
  };

  // Focus color variants
  const focusColorClasses = {
    blue: 'focus:border-blue-500 focus:ring-blue-500',
    green: 'focus:border-green-500 focus:ring-green-500',
    primary: 'focus:border-blue-500 focus:ring-blue-500'
  };

  // Variant styles
  const variantThemes = {
    default: {
      sidebar: 'bg-white border border-gray-300 text-gray-700 placeholder-gray-400',
      main: 'bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-white/50'
    },
    minimal: {
      sidebar: 'border-0 border-b-2 border-gray-200 bg-transparent text-gray-800',
      main: 'border-0 border-b-2 border-white/20 bg-transparent text-white placeholder-white/40'
    },
    filled: {
      sidebar: 'bg-gray-50 border border-gray-300 text-gray-700 placeholder-gray-500',
      main: 'bg-white/5 border border-white/10 text-white placeholder-white/40'
    }
  };

  // Get theme classes
  const themeClasses = getCustomTheme(isInSidebar, variantThemes[variant] || variantThemes.default);
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const focusColorClass = focusColorClasses[focusColor] || focusColorClasses.blue;

  // Base classes
  const baseClasses = 'w-full rounded focus:outline-none transition-colors';
  
  // For sidebar context, add focus ring, for main context it's already handled in theme
  const focusClasses = isInSidebar 
    ? `focus:ring-2 ${focusColorClass}` 
    : focusColorClass;

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      id={id}
      name={name}
      min={min}
      max={max}
      disabled={disabled}
      autoFocus={autoFocus}
      onKeyDown={onKeyDown}
      className={`${baseClasses} ${sizeClass} ${themeClasses} ${focusClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    />
  );
};

export default FormInput;