'use client';

export default function TimerControls({ 
  onOpenTasks, 
  onOpenStats, 
  onOpenSettings 
}) {
  return (
    <div className="absolute top-4 right-4 flex gap-2">
      {/* Tasks Button */}
      <button
        id="tasks-button"
        onClick={onOpenTasks}
        className="w-8 h-8 group transition-colors"
        title="Tasks"
      >
        <img 
          src="/icons/task-list.svg" 
          alt="Tasks" 
          className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity"
          style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }}
        />
      </button>

      {/* Statistics Button */}
      <button
        id="stats-button"
        onClick={onOpenStats}
        className="w-8 h-8 group transition-colors"
        title="Statistics"
      >
        <img 
          src="/icons/statistics.svg" 
          alt="Statistics" 
          className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity"
          style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }}
        />
      </button>
      
      {/* Settings Button */}
      <button
        id="settings-button"
        onClick={onOpenSettings}
        className="w-8 h-8 group transition-colors"
        title="Settings"
      >
        <img 
          src="/icons/settings.svg" 
          alt="Settings" 
          className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity"
          style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }}
        />
      </button>
    </div>
  );
}