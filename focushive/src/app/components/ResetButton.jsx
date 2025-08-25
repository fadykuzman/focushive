export default function ResetButton({ resetTimer, isRunning, mode }) {
  // Get style classes based on mode
  const getButtonClasses = (currentMode) => {
    switch (currentMode) {
      case 'focus':
        return 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600 hover:border-gray-500';
      case 'shortBreak':
        return 'bg-green-700 text-green-300 hover:bg-green-800 border border-green-600 hover:border-green-500';
      case 'longBreak':
        return 'bg-blue-700 text-blue-300 hover:bg-blue-800 border border-blue-600 hover:border-blue-500';
      default:
        return 'bg-red-700 text-red-300 hover:bg-red-800 border border-red-600 hover:border-red-500';
    }
  };

  return (
    <button
      onClick={resetTimer}
      className={`
        w-14 h-14 rounded-full font-bold text-2xl transition-all
        flex items-center justify-center
        hover:scale-105 shadow-lg hover:shadow-xl
        ${getButtonClasses(mode)}
      `}
      title="Reset Timer"
    >
      ↻
    </button>
  );
}
