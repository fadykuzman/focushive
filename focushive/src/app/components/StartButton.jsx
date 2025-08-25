export default function StartButton({isRunning, startTimer}) {
  return (
    <button
      onClick={startTimer}
      disabled={isRunning}
      className={`
              px-8 py-4 rounded-lg font-bold text-xl transition-all
              ${
                isRunning
                  ? "bg-red-700 text-red-300 cursor-not-allowed opacity-50"
                  : "bg-black-700 text-red-400 hover:text-red-700 shadow-lg hover:cursor-pointer transform border border-red-400 hover:border-red-300 hover:scale-105"
              }
            `}
    >
      {isRunning ? "Running..." : "Start Focus"}
    </button>
  );
}
