import { useTaskManager } from './useTaskManager';

export function useTaskIntegration(linkedTaskId, setLinkedTask, clearLinkedTask, startTimer) {
  const { tasks } = useTaskManager();

  // Get current linked task
  const currentTask = linkedTaskId ? tasks.find(task => task.id === linkedTaskId) : null;

  // Handle task selection
  const handleTaskSelect = (task) => {
    if (task) {
      setLinkedTask(task.id);
      // Auto-set task to in_progress when selected for focus
      if (task.status === 'pending') {
        // Note: This could be handled by the task list component
      }
    } else {
      clearLinkedTask();
    }
  };

  // Handle start timer with task
  const handleStartTimer = () => {
    startTimer(linkedTaskId);
  };

  return {
    currentTask,
    handleTaskSelect,
    handleStartTimer
  };
}