import IconButton from '@/app/components/shared/IconButton';

export default function StartButton({ startTimer, resumeTimer, isPaused, mode }) {

  const handleClick = () => {
    if (isPaused) {
      resumeTimer();
    } else {
      startTimer();
    }
  };

  return (
    <IconButton
      icon="/icons/play.svg"
      size="lg"
      variant="primary"
      onClick={handleClick}
      ariaLabel={isPaused ? "Resume" : "Start"}
    />
  );
}
