"use client";

const IconButton = ({ 
  icon, 
  alt = "", 
  size = 'md', 
  variant = 'default',
  onClick, 
  disabled = false,
  className = '',
  title,
  id,
  ariaLabel
}) => {
  // Size variants
  const sizeClasses = {
    sm: {
      button: 'w-6 h-6',
      icon: 'w-4 h-4'
    },
    md: {
      button: 'w-8 h-8',
      icon: 'w-6 h-6'
    },
    lg: {
      button: 'w-12 h-12',
      icon: 'w-12 h-12'
    }
  };

  // Variant styles
  const variantClasses = {
    default: 'opacity-70 group-hover:opacity-100',
    primary: 'opacity-80 group-hover:opacity-100',
    secondary: 'opacity-60 group-hover:opacity-90'
  };

  const { button: buttonSize, icon: iconSize } = sizeClasses[size] || sizeClasses.md;
  const variantClass = variantClasses[variant] || variantClasses.default;

  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      className={`${buttonSize} group transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title={title}
      aria-label={ariaLabel || alt}
    >
      <img 
        src={icon} 
        alt={alt} 
        className={`${iconSize} ${variantClass} transition-opacity`}
        style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }}
      />
    </button>
  );
};

export default IconButton;