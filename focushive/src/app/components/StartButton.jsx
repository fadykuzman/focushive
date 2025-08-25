export default function StartButton({isRunning, startTimer, mode}) {
  // Get style classes based on mode
  const getButtonClasses = (currentMode, running) => {
    if (running) {
      switch (currentMode) {
        case 'focus':
          return 'bg-gray-700 text-gray-300 cursor-not-allowed opacity-50';
        case 'shortBreak':
          return 'bg-green-700 text-green-300 cursor-not-allowed opacity-50';
        case 'longBreak':
          return 'bg-blue-700 text-blue-300 cursor-not-allowed opacity-50';
        default:
          return 'bg-red-700 text-red-300 cursor-not-allowed opacity-50';
      }
    } else {
      switch (currentMode) {
        case 'focus':
          return 'bg-white text-black hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5';
        case 'shortBreak':
          return 'bg-white text-green-600 hover:bg-green-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5';
        case 'longBreak':
          return 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5';
        default:
          return 'bg-white text-red-500 hover:bg-red-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5';
      }
    }
  };

  return (
    <button
      onClick={startTimer}
      disabled={isRunning}
      className={`
        px-8 py-4 rounded-lg font-bold text-xl transition-all
        ${getButtonClasses(mode, isRunning)}
      `}
    >
      {isRunning ? "Running..." : "Start"}
    </button>
  );
}
