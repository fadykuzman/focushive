'use client';

import { useState } from 'react';
import { useTaskManager } from '../../hooks/useTaskManager';

const TaskManager = () => {
  const {
    tasks,
    loading,
    error,
    activeTaskId,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    setActiveTask,
    clearActiveTask,
    getPendingTasks,
    getInProgressTasks,
    getCompletedTasks
  } = useTaskManager();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    estimatedDuration: '',
    dueDate: ''
  });

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const taskData = {
        ...newTask,
        estimatedDuration: newTask.estimatedDuration ? parseInt(newTask.estimatedDuration) * 60 : null,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null
      };
      
      await addTask(taskData);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        estimatedDuration: '',
        dueDate: ''
      });
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleTaskAction = async (taskId, action) => {
    try {
      switch (action) {
        case 'complete':
          await completeTask(taskId);
          break;
        case 'start':
          await updateTask(taskId, { status: 'in_progress' });
          setActiveTask(taskId);
          break;
        case 'pause':
          await updateTask(taskId, { status: 'pending' });
          if (activeTaskId === taskId) clearActiveTask();
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete this task?')) {
            await deleteTask(taskId);
          }
          break;
      }
    } catch (err) {
      console.error(`Failed to ${action} task:`, err);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '—';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in_progress': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const TaskItem = ({ task }) => (
    <div 
      id={`task-${task.id}`}
      className={`p-4 border rounded-lg ${activeTaskId === task.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
          </div>
          
          {task.description && (
            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
          )}
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Time: {formatDuration(task.totalTimeSpent)}</span>
            {task.estimatedDuration && (
              <span>Est: {formatDuration(task.estimatedDuration)}</span>
            )}
            <span>Sessions: {task.sessionsCount || 0}</span>
            {task.productivityScore > 0 && (
              <span>Score: {task.productivityScore}%</span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {task.status === 'pending' && (
            <button
              onClick={() => handleTaskAction(task.id, 'start')}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Start
            </button>
          )}
          
          {task.status === 'in_progress' && (
            <button
              onClick={() => handleTaskAction(task.id, 'pause')}
              className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Pause
            </button>
          )}
          
          {task.status !== 'completed' && (
            <button
              onClick={() => handleTaskAction(task.id, 'complete')}
              className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
            >
              Complete
            </button>
          )}
          
          <button
            onClick={() => handleTaskAction(task.id, 'delete')}
            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center py-4">Loading tasks...</div>;
  }

  return (
    <div id="task-manager" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showAddForm ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleAddTask} className="p-4 border rounded-lg bg-gray-50 space-y-3">
          <div>
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <textarea
              placeholder="Description (optional)"
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
          
          <div className="flex gap-3">
            <div className="flex-1">
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            
            <div className="flex-1">
              <input
                type="number"
                placeholder="Est. duration (min)"
                value={newTask.estimatedDuration}
                onChange={(e) => setNewTask(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
          </div>
          
          <div>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {activeTaskId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h3 id="active-task-header" data-testid="active-task-header" className="font-medium text-blue-800 mb-2">Active Task</h3>
            {tasks.find(task => task.id === activeTaskId) && (
              <TaskItem task={tasks.find(task => task.id === activeTaskId)} />
            )}
          </div>
        )}

        <div>
          <h3 className="font-medium text-gray-700 mb-2">In Progress ({getInProgressTasks().length})</h3>
          <div className="space-y-2">
            {getInProgressTasks().map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-700 mb-2">Pending ({getPendingTasks().length})</h3>
          <div className="space-y-2">
            {getPendingTasks().map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-700 mb-2">Completed ({getCompletedTasks().length})</h3>
          <div className="space-y-2">
            {getCompletedTasks().slice(0, 5).map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
            {getCompletedTasks().length > 5 && (
              <p className="text-sm text-gray-500 text-center">
                ... and {getCompletedTasks().length - 5} more completed tasks
              </p>
            )}
          </div>
        </div>
      </div>

      {tasks.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          <p>No tasks yet. Add your first task to get started!</p>
        </div>
      )}
    </div>
  );
};

export default TaskManager;