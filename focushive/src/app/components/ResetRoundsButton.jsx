export default function ResetRoundsButton({ resetRounds, mode }) {
  return (
    <button
      onClick={resetRounds}
      className="w-8 h-8 text-white/70 hover:text-white transition-colors font-bold text-xl flex items-center justify-center"
      title="Reset Rounds (Back to Round 1)"
    >
      ⟲
    </button>
  );
}