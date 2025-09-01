'use client';

import { useState } from 'react';
import { useTaskManager } from '../hooks/useTaskManager';
import TaskTemplates from './TaskTemplates';

const PomofocusTaskList = ({ onTaskSelect, selectedTaskId }) => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    getPendingTasks,
    getInProgressTasks
  } = useTaskManager();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState(1);

  const handleTemplateSelect = async (template) => {
    try {
      const taskData = {
        title: template.title,
        estimatedPomodoros: template.estimatedPomodoros,
        estimatedDuration: template.estimatedPomodoros * 25 * 60,
        status: 'pending'
      };
      
      const newTask = await addTask(taskData);
      onTaskSelect?.(newTask);
    } catch (err) {
      console.error('Failed to create task from template:', err);
    }
  };

  const todayTasks = [...getPendingTasks(), ...getInProgressTasks()];
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const taskData = {
        title: newTaskTitle,
        estimatedPomodoros: newTaskPomodoros,
        estimatedDuration: newTaskPomodoros * 25 * 60,
        status: 'pending'
      };
      
      await addTask(taskData);
      setNewTaskTitle('');
      setNewTaskPomodoros(1);
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleTaskComplete = async (taskId) => {
    try {
      await completeTask(taskId);
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      if (selectedTaskId === taskId) {
        onTaskSelect?.(null);
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const incrementPomodoros = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newPomodoros = (task.estimatedPomodoros || 1) + 1;
      await updateTask(taskId, {
        estimatedPomodoros: newPomodoros,
        estimatedDuration: newPomodoros * 25 * 60
      });
    }
  };

  const decrementPomodoros = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && (task.estimatedPomodoros || 1) > 1) {
      const newPomodoros = (task.estimatedPomodoros || 1) - 1;
      await updateTask(taskId, {
        estimatedPomodoros: newPomodoros,
        estimatedDuration: newPomodoros * 25 * 60
      });
    }
  };

  const TaskItem = ({ task, isSelected }) => (
    <div 
      id={`pomofocus-task-${task.id}`}
      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
        isSelected 
          ? 'border-white bg-white/10 text-white' 
          : 'border-white/20 hover:border-white/40 text-white/80 hover:text-white'
      }`}
      onClick={() => onTaskSelect?.(task)}
    >
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleTaskComplete(task.id);
          }}
          className="w-6 h-6 rounded-full border-2 border-white/40 hover:border-white flex items-center justify-center"
        >
          {task.status === 'completed' && (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        <div className="flex-1">
          <div className={`font-medium ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
            {task.title}
          </div>
          <div className="text-sm opacity-60">
            {Math.floor((task.totalTimeSpent || 0) / 1500)} / {task.estimatedPomodoros || 1} pomodoros
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            decrementPomodoros(task.id);
          }}
          className="w-6 h-6 rounded hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
        >
          −
        </button>
        
        <span className="text-sm font-medium min-w-[20px] text-center">
          {task.estimatedPomodoros || 1}
        </span>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            incrementPomodoros(task.id);
          }}
          className="w-6 h-6 rounded hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
        >
          +
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleTaskDelete(task.id);
          }}
          className="w-6 h-6 rounded hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-red-400 ml-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div id="pomofocus-task-list" className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">Tasks</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="text-white/60 hover:text-white text-sm"
        >
          + Add Task
        </button>
      </div>

      {showAddForm && (
        <div className="p-4 rounded-lg border border-white/20 bg-white/5">
          <form onSubmit={handleAddTask} className="space-y-3">
            <input
              type="text"
              placeholder="What are you working on?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/50"
              autoFocus
            />
            
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-sm">Est Pomodoros:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setNewTaskPomodoros(Math.max(1, newTaskPomodoros - 1))}
                  className="w-6 h-6 rounded hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
                >
                  −
                </button>
                <span className="text-white font-medium min-w-[20px] text-center">
                  {newTaskPomodoros}
                </span>
                <button
                  type="button"
                  onClick={() => setNewTaskPomodoros(newTaskPomodoros + 1)}
                  className="w-6 h-6 rounded hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-white/20 text-white rounded hover:bg-white/30 text-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewTaskTitle('');
                  setNewTaskPomodoros(1);
                }}
                className="px-4 py-2 text-white/60 hover:text-white text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-2">
        {todayTasks.map(task => (
          <TaskItem 
            key={task.id} 
            task={task} 
            isSelected={selectedTaskId === task.id}
          />
        ))}
      </div>

      {todayTasks.length === 0 && !showAddForm && (
        <div className="text-center py-4 text-white/40">
          <p className="text-sm">Add tasks to work on today</p>
        </div>
      )}

      <TaskTemplates onTemplateSelect={handleTemplateSelect} />

      {completedTasks.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white/60 text-sm font-medium">
              Completed ({completedTasks.length})
            </h4>
          </div>
          <div className="space-y-1">
            {completedTasks.slice(0, 3).map(task => (
              <div key={task.id} className="flex items-center gap-3 py-2 text-white/40 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="line-through">{task.title}</span>
                <span className="text-xs">
                  {Math.floor((task.totalTimeSpent || 0) / 1500)} pomodoros
                </span>
              </div>
            ))}
            {completedTasks.length > 3 && (
              <div className="text-center text-white/30 text-xs py-1">
                ... and {completedTasks.length - 3} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PomofocusTaskList;