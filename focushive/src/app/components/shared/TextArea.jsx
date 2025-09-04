"use client";

import { forwardRef } from 'react';
import { getCustomTheme } from '@/app/utils/themeUtils';

const TextArea = forwardRef(({
  value,
  onChange,
  placeholder,
  className = '',
  id,
  name,
  disabled = false,
  isInSidebar = false,
  variant = 'default',
  size = 'md',
  focusColor = 'blue',
  resize = 'vertical',
  rows = 4,
  onKeyDown,
  ...props
}, ref) => {
  // Size variants
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm h-32',
    md: 'px-3 py-2 h-48',
    lg: 'px-4 py-3 text-lg h-64'
  };

  // Focus color variants
  const focusColorClasses = {
    blue: 'focus:border-blue-500 focus:ring-blue-500',
    green: 'focus:border-green-500 focus:ring-green-500',
    primary: 'focus:border-blue-500 focus:ring-blue-500'
  };

  // Resize variants
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-vertical',
    horizontal: 'resize-horizontal',
    both: 'resize'
  };

  // Variant styles
  const variantThemes = {
    default: {
      sidebar: 'bg-white border-2 border-gray-200 text-gray-700 placeholder-gray-500',
      main: 'bg-white/10 border-2 border-white/20 text-white placeholder-white/50 focus:border-white/50'
    },
    minimal: {
      sidebar: 'border border-gray-300 bg-transparent text-gray-800 placeholder-gray-400',
      main: 'border border-white/20 bg-transparent text-white placeholder-white/40'
    },
    filled: {
      sidebar: 'bg-gray-50 border-2 border-gray-300 text-gray-700 placeholder-gray-500',
      main: 'bg-white/5 border-2 border-white/10 text-white placeholder-white/40'
    }
  };

  // Get theme classes
  const themeClasses = getCustomTheme(isInSidebar, variantThemes[variant] || variantThemes.default);
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const focusColorClass = focusColorClasses[focusColor] || focusColorClasses.blue;
  const resizeClass = resizeClasses[resize] || resizeClasses.vertical;

  // Base classes
  const baseClasses = 'w-full rounded-lg focus:outline-none transition-colors';
  
  // For sidebar context, add focus ring, for main context it's already handled in theme
  const focusClasses = isInSidebar 
    ? `focus:ring-2 ${focusColorClass}` 
    : focusColorClass;

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      id={id}
      name={name}
      disabled={disabled}
      rows={rows}
      onKeyDown={onKeyDown}
      className={`${baseClasses} ${sizeClass} ${themeClasses} ${focusClasses} ${resizeClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    />
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;