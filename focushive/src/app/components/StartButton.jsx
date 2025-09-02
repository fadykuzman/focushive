import { getActionButtonStyles } from '@/app/utils/buttonStyles';

export default function StartButton({ startTimer, resumeTimer, isPaused, mode }) {

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
      className="w-12 h-12 group transition-colors"
      aria-label={isPaused ? "Resume" : "Start"}
    >
      <img 
        src="/icons/play.svg" 
        alt="" 
        className="w-12 h-12 opacity-70 group-hover:opacity-100 transition-opacity"
        style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }}
      />
    </button>
  );
}
