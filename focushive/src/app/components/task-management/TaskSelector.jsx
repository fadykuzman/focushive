'use client';

import useTaskStore from '../../stores/taskStore';

const TaskSelector = ({ onTaskSelect, selectedTaskId }) => {
  const tasks = useTaskStore(state => state.tasks);
  const getActiveTask = useTaskStore(state => state.getActiveTask);
  const setActiveTask = useTaskStore(state => state.setActiveTask);
  const clearActiveTask = useTaskStore(state => state.clearActiveTask);
  
  const availableTasks = tasks.filter(task => 
    task.status === 'pending' || task.status === 'in_progress'
  );

  const handleTaskChange = (taskId) => {
    if (taskId === '') {
      clearActiveTask();
      onTaskSelect?.(null);
    } else {
      setActiveTask(taskId);
      const task = tasks.find(t => t.id === taskId);
      onTaskSelect?.(task);
    }
  };

  const activeTask = getActiveTask();

  return (
    <div id="task-selector" className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Link to Task (Optional)
      </label>
      
      <select
        value={selectedTaskId || ''}
        onChange={(e) => handleTaskChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">No task selected</option>
        {availableTasks.map(task => (
          <option key={task.id} value={task.id}>
            {task.title} ({task.status === 'in_progress' ? 'In Progress' : 'Pending'})
          </option>
        ))}
      </select>
      
      {activeTask && (
        <div className="p-2 bg-blue-50 border border-blue-200 rounded text-sm">
          <div className="font-medium text-blue-800">{activeTask.title}</div>
          {activeTask.description && (
            <div className="text-blue-600 mt-1">{activeTask.description}</div>
          )}
          <div className="text-blue-500 mt-1 text-xs">
            Time spent: {Math.floor((activeTask.totalTimeSpent || 0) / 60)}m | 
            Sessions: {activeTask.sessionsCount || 0}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskSelector;