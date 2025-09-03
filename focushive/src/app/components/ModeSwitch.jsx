import { getModeButtonStyles } from '@/app/utils/buttonStyles';

export default function ModeSwitch({ mode, switchMode, onRequestModeSwitch }) {
  const handleModeClick = (newMode) => {
    if (newMode === mode) return; // No need to switch to same mode
    
    if (onRequestModeSwitch) {
      onRequestModeSwitch(newMode);
    } else {
      switchMode(newMode);
    }
  };

  return (
    <div id="mode-switch" className="flex flex-col sm:flex-row gap-2 justify-center">
      <button 
        id="focus-mode-button"
        onClick={() => handleModeClick('focus')}
        className={`px-4 py-2 rounded-lg text-ui-sm w-full sm:w-32 ${getModeButtonStyles('focus', mode)}`}
      >
        Focus
      </button>
      <button 
        id="short-break-mode-button"
        onClick={() => handleModeClick('shortBreak')}
        className={`px-4 py-2 rounded-lg text-ui-sm w-full sm:w-36 ${getModeButtonStyles('shortBreak', mode)}`}
      >
        Short Break
      </button>
      <button 
        id="long-break-mode-button"
        onClick={() => handleModeClick('longBreak')}
        className={`px-4 py-2 rounded-lg text-ui-sm w-full sm:w-36 ${getModeButtonStyles('longBreak', mode)}`}
      >
        Long Break
      </button>
    </div>
  );
}