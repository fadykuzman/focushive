import { getModeButtonStyles } from '../utils/buttonStyles';

export default function ModeSwitch({ mode, switchMode }) {

  return (
    <div id="mode-switch" className="flex flex-col sm:flex-row gap-2 justify-center">
      <button 
        id="focus-mode-button"
        onClick={() => switchMode('focus')}
        className={`px-4 py-2 rounded-lg font-semibold text-sm w-full sm:w-32 ${getModeButtonStyles('focus', mode)}`}
      >
        Focus
      </button>
      <button 
        id="short-break-mode-button"
        onClick={() => switchMode('shortBreak')}
        className={`px-4 py-2 rounded-lg font-semibold text-sm w-full sm:w-36 ${getModeButtonStyles('shortBreak', mode)}`}
      >
        Short Break
      </button>
      <button 
        id="long-break-mode-button"
        onClick={() => switchMode('longBreak')}
        className={`px-4 py-2 rounded-lg font-semibold text-sm w-full sm:w-36 ${getModeButtonStyles('longBreak', mode)}`}
      >
        Long Break
      </button>
    </div>
  );
}