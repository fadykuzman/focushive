import { getSecondaryButtonStyles } from '../utils/buttonStyles';

export default function PauseButton({ pauseTimer, mode }) {

  return (
    <button
      onClick={pauseTimer}
      className="w-12 h-12 group transition-colors"
      aria-label="Pause"
    >
      <img 
        src="/icons/pause.svg" 
        alt="" 
        className="w-12 h-12 opacity-70 group-hover:opacity-100 transition-opacity"
        style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }}
      />
    </button>
  );
}