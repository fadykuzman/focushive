import { getSecondaryButtonStyles } from '../utils/buttonStyles';

export default function PauseButton({ pauseTimer, mode }) {

  return (
    <button
      onClick={pauseTimer}
      className={`px-8 py-4 rounded-lg font-bold text-xl ${getSecondaryButtonStyles(mode)}`}
    >
      Pause
    </button>
  );
}