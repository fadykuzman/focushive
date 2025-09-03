export default function ToggleSwitch({ enabled = false, disabled = false, label, onChange }) {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!enabled);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
        ${disabled 
          ? 'bg-gray-200 cursor-not-allowed' 
          : enabled 
            ? 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500' 
            : 'bg-gray-300 hover:bg-gray-400 focus:ring-gray-500'
        }
      `}
      role="switch"
      aria-checked={enabled}
      aria-disabled={disabled}
      aria-label={label}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${enabled ? 'translate-x-6' : 'translate-x-1'}
          ${disabled ? 'bg-gray-300' : 'bg-white'}
        `}
      />
    </button>
  );
}