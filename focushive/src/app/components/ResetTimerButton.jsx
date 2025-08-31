export default function ResetTimerButton({ resetTimer, isRunning, mode }) {
  return (
    <button
      onClick={resetTimer}
      className="w-14 h-14 text-white/70 hover:text-white transition-colors font-bold text-2xl flex items-center justify-center"
      title="Reset Timer"
    >
      ↻
    </button>
  );
}
