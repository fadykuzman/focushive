import { getModeButtonStyles } from '../utils/buttonStyles';

export default function ModeSwitch({ mode, switchMode }) {

  return (
    <div id="mode-switch" className="flex gap-2 justify-center">
      <button 
        id="focus-mode-button"
        onClick={() => switchMode('focus')}
        className={`px-4 py-2 rounded-lg font-semibold text-sm ${getModeButtonStyles('focus', mode)}`}
      >
        Focus
      </button>
      <button 
        id="short-break-mode-button"
        onClick={() => switchMode('shortBreak')}
        className={`px-4 py-2 rounded-lg font-semibold text-sm ${getModeButtonStyles('shortBreak', mode)}`}
      >
        Short Break
      </button>
      <button 
        id="long-break-mode-button"
        onClick={() => switchMode('longBreak')}
        className={`px-4 py-2 rounded-lg font-semibold text-sm ${getModeButtonStyles('longBreak', mode)}`}
      >
        Long Break
      </button>
    </div>
  );
}