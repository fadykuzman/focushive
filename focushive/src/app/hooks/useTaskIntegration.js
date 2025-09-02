import useTaskStore from '../stores/taskStore';

export function useTaskIntegration(linkedTaskId, setLinkedTask, clearLinkedTask, startTimer) {
  const tasks = useTaskStore(state => state.tasks);

  // Get current linked task
  const currentTask = linkedTaskId ? tasks.find(task => task.id === linkedTaskId) : null;

  // Handle task selection with toggle behavior
  const handleTaskSelect = (task) => {
    if (task) {
      // If clicking on the already selected task, deselect it
      if (linkedTaskId === task.id) {
        clearLinkedTask();
      } else {
        setLinkedTask(task.id);
        // Auto-set task to in_progress when selected for focus
        if (task.status === 'pending') {
          // Note: This could be handled by the task list component
        }
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