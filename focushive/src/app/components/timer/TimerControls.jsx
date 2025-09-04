'use client';

import IconButton from '@/app/components/shared/IconButton';

export default function TimerControls({ 
  onOpenTasks, 
  onOpenStats, 
  onOpenSettings 
}) {
  return (
    <div className="absolute top-4 right-4 flex gap-2">
      {/* Tasks Button */}
      <IconButton
        id="tasks-button"
        icon="/icons/task-list.svg"
        alt="Tasks"
        size="md"
        onClick={onOpenTasks}
        title="Tasks"
      />

      {/* Statistics Button */}
      <IconButton
        id="stats-button"
        icon="/icons/statistics.svg"
        alt="Statistics"
        size="md"
        onClick={onOpenStats}
        title="Statistics"
      />
      
      {/* Settings Button */}
      <IconButton
        id="settings-button"
        icon="/icons/settings.svg"
        alt="Settings"
        size="md"
        onClick={onOpenSettings}
        title="Settings"
      />
    </div>
  );
}