export default function ModeSwitch({ mode, switchMode }) {
  const getModeButtonClass = (buttonMode, currentMode) => {
    const isActive = buttonMode === currentMode;
    
    switch (buttonMode) {
      case 'focus':
        return isActive 
          ? 'bg-white text-black font-bold border-2 border-white' 
          : 'bg-black-700 text-gray-300 hover:text-gray-100 border-2 border-gray-600 hover:border-gray-500';
      case 'shortBreak':
        return isActive 
          ? 'bg-white text-green-600 font-bold border-2 border-white' 
          : 'bg-green-700 text-green-300 hover:text-green-100 border-2 border-green-600 hover:border-green-500';
      case 'longBreak':
        return isActive 
          ? 'bg-white text-blue-600 font-bold border-2 border-white' 
          : 'bg-blue-700 text-blue-300 hover:text-blue-100 border-2 border-blue-600 hover:border-blue-500';
      default:
        return 'bg-gray-700 text-gray-300 hover:text-gray-100 border-2 border-gray-600 hover:border-gray-500';
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      <button 
        onClick={() => switchMode('focus')}
        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${getModeButtonClass('focus', mode)}`}
      >
        Focus
      </button>
      <button 
        onClick={() => switchMode('shortBreak')}
        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${getModeButtonClass('shortBreak', mode)}`}
      >
        Short Break
      </button>
      <button 
        onClick={() => switchMode('longBreak')}
        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${getModeButtonClass('longBreak', mode)}`}
      >
        Long Break
      </button>
    </div>
  );
}