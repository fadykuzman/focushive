export default function StartButton({ startTimer, resumeTimer, isPaused, mode }) {
  // Get style classes based on mode
  const getButtonClasses = (currentMode) => {
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
  };

  const handleClick = () => {
    if (isPaused) {
      resumeTimer();
    } else {
      startTimer();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        px-8 py-4 rounded-lg font-bold text-xl transition-all
        ${getButtonClasses(mode)}
      `}
    >
      {isPaused ? "Resume" : "Start"}
    </button>
  );
}
