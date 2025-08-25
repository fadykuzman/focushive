export default function ResetButton({ resetTimer, isRunning, mode }) {
  // Get style classes based on mode
  const getButtonClasses = (currentMode) => {
    return "bg-black-700 text-gray-300 hover:text-gray-600 hover:cursor-pointer border border-gray-600 hover:border-gray-500";
    // switch (currentMode) {
    //   case 'focus':
    //     return 'bg-black-700 text-gray-300 hover:text-gray-600 hover:cursor-pointer border border-gray-600 hover:border-gray-500';
    //   case 'shortBreak':
    //     return 'bg-green-700 text-green-300 hover:bg-green-800';
    //   case 'longBreak':
    //     return 'bg-blue-700 text-blue-300 hover:bg-blue-800';
    //   default:
    //     return 'bg-red-700 text-red-300 hover:bg-red-800';
    // }
  };

  return (
    <button
      onClick={resetTimer}
      className={`
        px-6 py-3 rounded-lg font-bold text-lg transition-all
        ${getButtonClasses(mode)}
      `}
    >
      Reset
    </button>
  );
}
