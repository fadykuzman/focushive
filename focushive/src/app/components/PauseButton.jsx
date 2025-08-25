export default function PauseButton({ pauseTimer, mode }) {
  // Get style classes based on mode
  const getButtonClasses = (currentMode) => {
    switch (currentMode) {
      case 'focus':
        return 'bg-gray-600 text-gray-200 hover:bg-gray-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5';
      case 'shortBreak':
        return 'bg-green-600 text-green-200 hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5';
      case 'longBreak':
        return 'bg-blue-600 text-blue-200 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5';
      default:
        return 'bg-red-600 text-red-200 hover:bg-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5';
    }
  };

  return (
    <button
      onClick={pauseTimer}
      className={`
        px-8 py-4 rounded-lg font-bold text-xl transition-all
        ${getButtonClasses(mode)}
      `}
    >
      Pause
    </button>
  );
}