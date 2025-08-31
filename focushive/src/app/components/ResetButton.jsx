import { getSecondaryButtonStyles } from '../utils/buttonStyles';

export default function ResetButton({ resetTimer, isRunning, mode }) {

  return (
    <button
      onClick={resetTimer}
      className={`w-14 h-14 rounded-full font-bold text-2xl flex items-center justify-center ${getSecondaryButtonStyles(mode)}`}
      title="Reset Timer"
    >
      ↻
    </button>
  );
}
