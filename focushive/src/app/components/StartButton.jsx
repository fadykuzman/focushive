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
                  : "bg-white text-red-500 hover:bg-red-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              }
            `}
    >
      {isRunning ? "Running..." : "Start Focus"}
    </button>
  );
}
