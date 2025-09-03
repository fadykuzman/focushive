export const getBaseButtonStyles = () => {
  return 'transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5';
};

export const getModeButtonStyles = (buttonMode, currentMode, isActive = false) => {
  const baseStyles = getBaseButtonStyles();
  const activeState = isActive || (buttonMode === currentMode);
  
  switch (buttonMode) {
    case 'focus':
      return activeState 
        ? `bg-white text-focus-600 font-bold border-2 border-white ${baseStyles}`
        : `bg-transparent text-white/70 hover:text-white ${baseStyles}`;
    case 'shortBreak':
      return activeState 
        ? `bg-white text-break-600 font-bold border-2 border-white ${baseStyles}`
        : `bg-transparent text-white/70 hover:text-white ${baseStyles}`;
    case 'longBreak':
      return activeState 
        ? `bg-white text-longbreak-600 font-bold border-2 border-white ${baseStyles}`
        : `bg-transparent text-white/70 hover:text-white ${baseStyles}`;
    default:
      return `bg-transparent text-white/70 hover:text-white ${baseStyles}`;
  }
};

export const getActionButtonStyles = (mode) => {
  const baseStyles = getBaseButtonStyles();
  
  switch (mode) {
    case 'focus':
      return `bg-white text-focus-700 hover:bg-focus-50 ${baseStyles}`;
    case 'shortBreak':
      return `bg-white text-break-600 hover:bg-break-50 ${baseStyles}`;
    case 'longBreak':
      return `bg-white text-longbreak-600 hover:bg-longbreak-50 ${baseStyles}`;
    default:
      return `bg-white text-danger-500 hover:bg-danger-50 ${baseStyles}`;
  }
};

export const getSecondaryButtonStyles = (mode) => {
  const baseStyles = getBaseButtonStyles();
  
  switch (mode) {
    case 'focus':
      return `bg-transparent text-white/70 hover:text-white ${baseStyles}`;
    case 'shortBreak':
      return `bg-transparent text-white/70 hover:text-white ${baseStyles}`;
    case 'longBreak':
      return `bg-transparent text-white/70 hover:text-white ${baseStyles}`;
    default:
      return `bg-transparent text-white/70 hover:text-white ${baseStyles}`;
  }
};