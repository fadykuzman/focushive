import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTaskManager } from '../useTaskManager';

vi.mock('../../utils/taskDatabase', () => ({
  taskDatabase: {
    getAllTasks: vi.fn(),
    addTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    linkTaskToSession: vi.fn(),
    getTaskStats: vi.fn(),
    updateTaskProductivityScore: vi.fn(),
  }
}));

import { taskDatabase } from '@/app/utils/taskDatabase';

describe('useTaskManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load tasks on mount', async () => {
    const mockTasks = [
      { id: '1', title: 'Task 1', updatedAt: new Date('2025-01-02') },
      { id: '2', title: 'Task 2', updatedAt: new Date('2025-01-01') }
    ];
    
    taskDatabase.getAllTasks.mockResolvedValue(mockTasks);
    
    const { result } = renderHook(() => useTaskManager());
    
    expect(result.current.loading).toBe(true);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.tasks).toEqual([
      { id: '1', title: 'Task 1', updatedAt: new Date('2025-01-02') },
      { id: '2', title: 'Task 2', updatedAt: new Date('2025-01-01') }
    ]);
  });

  it('should add new task', async () => {
    const newTask = { id: '3', title: 'New Task' };
    taskDatabase.getAllTasks.mockResolvedValue([]);
    taskDatabase.addTask.mockResolvedValue(newTask);
    
    const { result } = renderHook(() => useTaskManager());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    await act(async () => {
      await result.current.addTask({ title: 'New Task' });
    });
    
    expect(taskDatabase.addTask).toHaveBeenCalledWith({ title: 'New Task' });
    expect(result.current.tasks).toContain(newTask);
  });

  it('should update existing task', async () => {
    const existingTask = { id: '1', title: 'Original', status: 'pending' };
    const updatedTask = { id: '1', title: 'Updated', status: 'completed' };
    
    taskDatabase.getAllTasks.mockResolvedValue([existingTask]);
    taskDatabase.updateTask.mockResolvedValue(updatedTask);
    
    const { result } = renderHook(() => useTaskManager());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    await act(async () => {
      await result.current.updateTask('1', { title: 'Updated', status: 'completed' });
    });
    
    expect(taskDatabase.updateTask).toHaveBeenCalledWith('1', { title: 'Updated', status: 'completed' });
    expect(result.current.tasks[0]).toEqual(updatedTask);
  });

  it('should delete task', async () => {
    const task = { id: '1', title: 'To Delete' };
    taskDatabase.getAllTasks.mockResolvedValue([task]);
    taskDatabase.deleteTask.mockResolvedValue();
    
    const { result } = renderHook(() => useTaskManager());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    await act(async () => {
      await result.current.deleteTask('1');
    });
    
    expect(taskDatabase.deleteTask).toHaveBeenCalledWith('1');
    expect(result.current.tasks).toHaveLength(0);
  });

  it('should set and clear active task', async () => {
    taskDatabase.getAllTasks.mockResolvedValue([]);
    
    const { result } = renderHook(() => useTaskManager());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    act(() => {
      result.current.setActiveTask('task_123');
    });
    
    expect(result.current.activeTaskId).toBe('task_123');
    
    act(() => {
      result.current.clearActiveTask();
    });
    
    expect(result.current.activeTaskId).toBeNull();
  });

  it('should filter tasks by status', async () => {
    const mockTasks = [
      { id: '1', status: 'pending', updatedAt: new Date() },
      { id: '2', status: 'in_progress', updatedAt: new Date() },
      { id: '3', status: 'completed', updatedAt: new Date() },
      { id: '4', status: 'pending', updatedAt: new Date() }
    ];
    
    taskDatabase.getAllTasks.mockResolvedValue(mockTasks);
    
    const { result } = renderHook(() => useTaskManager());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.getPendingTasks()).toHaveLength(2);
    expect(result.current.getInProgressTasks()).toHaveLength(1);
    expect(result.current.getCompletedTasks()).toHaveLength(1);
  });

  it('should complete task and update productivity score', async () => {
    const task = { id: '1', status: 'pending', updatedAt: new Date() };
    const completedTask = { id: '1', status: 'completed', completedAt: new Date() };
    
    taskDatabase.getAllTasks.mockResolvedValue([task]);
    taskDatabase.updateTask.mockResolvedValue(completedTask);
    taskDatabase.updateTaskProductivityScore.mockResolvedValue(85);
    
    const { result } = renderHook(() => useTaskManager());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    await act(async () => {
      await result.current.completeTask('1');
    });
    
    expect(taskDatabase.updateTask).toHaveBeenCalledWith('1', {
      status: 'completed',
      completedAt: expect.any(Date)
    });
    expect(taskDatabase.updateTaskProductivityScore).toHaveBeenCalledWith('1');
    expect(taskDatabase.getAllTasks).toHaveBeenCalledTimes(2);
  });
});