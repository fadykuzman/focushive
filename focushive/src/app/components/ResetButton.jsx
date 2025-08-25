export default function ResetButton({ resetTimer, isRunning }) {
  return (
    <button
      onClick={resetTimer}
      className={`
        px-6 py-3 rounded-lg font-bold text-lg transition-all
        ${
          isRunning
            ? "bg-red-700 text-red-300 hover:bg-red-800"
            : "bg-red-700 text-red-300 hover:bg-red-800"
        }
      `}
    >
      Reset
    </button>
  );
}