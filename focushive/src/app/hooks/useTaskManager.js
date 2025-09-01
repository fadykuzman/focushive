import { useState, useEffect, useCallback } from 'react';
import { taskDatabase } from '../utils/taskDatabase';

export const useTaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allTasks = await taskDatabase.getAllTasks();
      setTasks(allTasks.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    } catch (err) {
      setError(err.message);
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (taskData) => {
    try {
      setError(null);
      const newTask = await taskDatabase.addTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (taskId, updates) => {
    try {
      setError(null);
      const updatedTask = await taskDatabase.updateTask(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    try {
      setError(null);
      await taskDatabase.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      if (activeTaskId === taskId) {
        setActiveTaskId(null);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [activeTaskId]);

  const completeTask = useCallback(async (taskId) => {
    try {
      const updatedTask = await updateTask(taskId, { 
        status: 'completed',
        completedAt: new Date()
      });
      await taskDatabase.updateTaskProductivityScore(taskId);
      await loadTasks();
      return updatedTask;
    } catch (err) {
      throw err;
    }
  }, [updateTask, loadTasks]);

  const setActiveTask = useCallback((taskId) => {
    setActiveTaskId(taskId);
  }, []);

  const clearActiveTask = useCallback(() => {
    setActiveTaskId(null);
  }, []);

  const getActiveTask = useCallback(() => {
    return tasks.find(task => task.id === activeTaskId) || null;
  }, [tasks, activeTaskId]);

  const getPendingTasks = useCallback(() => {
    return tasks.filter(task => task.status === 'pending');
  }, [tasks]);

  const getInProgressTasks = useCallback(() => {
    return tasks.filter(task => task.status === 'in_progress' && task.id !== activeTaskId);
  }, [tasks, activeTaskId]);

  const getCompletedTasks = useCallback(() => {
    return tasks.filter(task => task.status === 'completed');
  }, [tasks]);

  const getTaskStats = useCallback(async (taskId) => {
    try {
      return await taskDatabase.getTaskStats(taskId);
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  const linkTaskToSession = useCallback(async (taskId, sessionId, timeSpent) => {
    try {
      setError(null);
      await taskDatabase.linkTaskToSession(taskId, sessionId, timeSpent);
      await loadTasks();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [loadTasks]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
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
    getActiveTask,
    
    getPendingTasks,
    getInProgressTasks,
    getCompletedTasks,
    
    getTaskStats,
    linkTaskToSession,
    
    refresh: loadTasks
  };
};