export const getBaseButtonStyles = () => {
  return 'transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5';
};

export const getModeButtonStyles = (buttonMode, currentMode, isActive = false) => {
  const baseStyles = getBaseButtonStyles();
  const activeState = isActive || (buttonMode === currentMode);
  
  switch (buttonMode) {
    case 'focus':
      return activeState 
        ? `bg-white text-black font-bold border-2 border-white ${baseStyles}`
        : `bg-transparent text-white/70 hover:text-white border-2 border-white/30 hover:border-white/50 ${baseStyles}`;
    case 'shortBreak':
      return activeState 
        ? `bg-white text-green-600 font-bold border-2 border-white ${baseStyles}`
        : `bg-transparent text-white/70 hover:text-white border-2 border-white/30 hover:border-white/50 ${baseStyles}`;
    case 'longBreak':
      return activeState 
        ? `bg-white text-blue-600 font-bold border-2 border-white ${baseStyles}`
        : `bg-transparent text-white/70 hover:text-white border-2 border-white/30 hover:border-white/50 ${baseStyles}`;
    default:
      return `bg-transparent text-white/70 hover:text-white border-2 border-white/30 hover:border-white/50 ${baseStyles}`;
  }
};

export const getActionButtonStyles = (mode) => {
  const baseStyles = getBaseButtonStyles();
  
  switch (mode) {
    case 'focus':
      return `bg-white text-black hover:bg-gray-100 ${baseStyles}`;
    case 'shortBreak':
      return `bg-white text-green-600 hover:bg-green-50 ${baseStyles}`;
    case 'longBreak':
      return `bg-white text-blue-600 hover:bg-blue-50 ${baseStyles}`;
    default:
      return `bg-white text-red-500 hover:bg-red-50 ${baseStyles}`;
  }
};

export const getSecondaryButtonStyles = (mode) => {
  const baseStyles = getBaseButtonStyles();
  
  switch (mode) {
    case 'focus':
      return `bg-transparent text-white/70 hover:text-white border-2 border-white/30 hover:border-white/50 ${baseStyles}`;
    case 'shortBreak':
      return `bg-transparent text-white/70 hover:text-white border-2 border-white/30 hover:border-white/50 ${baseStyles}`;
    case 'longBreak':
      return `bg-transparent text-white/70 hover:text-white border-2 border-white/30 hover:border-white/50 ${baseStyles}`;
    default:
      return `bg-transparent text-white/70 hover:text-white border-2 border-white/30 hover:border-white/50 ${baseStyles}`;
  }
};