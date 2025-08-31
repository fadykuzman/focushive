import { getActionButtonStyles } from '../utils/buttonStyles';

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
      className={`px-8 py-4 rounded-lg font-bold text-xl ${getActionButtonStyles(mode)}`}
    >
      {isPaused ? "Resume" : "Start"}
    </button>
  );
}
