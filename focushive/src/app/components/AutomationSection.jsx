import ToggleSwitch from './ToggleSwitch';

export default function AutomationSection({ autoTimerStart, onToggle }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Automation</h3>
      
      <div className="flex items-center justify-between">
        <label className="text-gray-600 font-medium">Auto Timer Start</label>
        <ToggleSwitch 
          enabled={autoTimerStart}
          disabled={false}
          label="Automatically start next timer after mode switch"
          onChange={onToggle}
        />
      </div>
    </div>
  );
}