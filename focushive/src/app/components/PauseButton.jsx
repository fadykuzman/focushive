import IconButton from '@/app/components/shared/IconButton';

export default function PauseButton({ pauseTimer, mode }) {

  return (
    <IconButton
      icon="/icons/pause.svg"
      size="lg"
      variant="secondary"
      onClick={pauseTimer}
      ariaLabel="Pause"
    />
  );
}