import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskManager from '../TaskManager';

const mockTaskManager = {
  tasks: [],
  loading: false,
  error: null,
  activeTaskId: null,
  addTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  completeTask: vi.fn(),
  setActiveTask: vi.fn(),
  clearActiveTask: vi.fn(),
  getPendingTasks: vi.fn(() => []),
  getInProgressTasks: vi.fn(() => []),
  getCompletedTasks: vi.fn(() => [])
};

vi.mock('../../hooks/useTaskManager', () => ({
  useTaskManager: () => mockTaskManager
}));

describe('TaskManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTaskManager.tasks = [];
    mockTaskManager.loading = false;
    mockTaskManager.error = null;
    mockTaskManager.activeTaskId = null;
  });

  it('should render empty state when no tasks', () => {
    render(<TaskManager />);
    
    expect(screen.getByText('No tasks yet. Add your first task to get started!')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    mockTaskManager.loading = true;
    
    render(<TaskManager />);
    
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  it('should display error message', () => {
    mockTaskManager.error = 'Database error';
    
    render(<TaskManager />);
    
    expect(screen.getByText('Database error')).toBeInTheDocument();
  });

  it('should show add task form when button clicked', async () => {
    render(<TaskManager />);
    
    const addButton = screen.getByText('Add Task');
    fireEvent.click(addButton);
    
    expect(screen.getByPlaceholderText('Task title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description (optional)')).toBeInTheDocument();
  });

  it('should add new task when form submitted', async () => {
    mockTaskManager.addTask.mockResolvedValue({
      id: 'new_task',
      title: 'New Task',
      status: 'pending'
    });
    
    render(<TaskManager />);
    
    fireEvent.click(screen.getByText('Add Task'));
    
    const titleInput = screen.getByPlaceholderText('Task title');
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    
    const submitButton = screen.getByText('Add Task');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockTaskManager.addTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Task',
          priority: 'medium'
        })
      );
    });
  });

  it('should display tasks organized by status', () => {
    const mockTasks = [
      { id: '1', title: 'Pending Task', status: 'pending', totalTimeSpent: 0, sessionsCount: 0 },
      { id: '2', title: 'In Progress Task', status: 'in_progress', totalTimeSpent: 300, sessionsCount: 1 },
      { id: '3', title: 'Completed Task', status: 'completed', totalTimeSpent: 600, sessionsCount: 2 }
    ];
    
    mockTaskManager.tasks = mockTasks;
    mockTaskManager.getPendingTasks.mockReturnValue([mockTasks[0]]);
    mockTaskManager.getInProgressTasks.mockReturnValue([mockTasks[1]]);
    mockTaskManager.getCompletedTasks.mockReturnValue([mockTasks[2]]);
    
    render(<TaskManager />);
    
    expect(screen.getByText('In Progress (1)')).toBeInTheDocument();
    expect(screen.getByText('Pending (1)')).toBeInTheDocument();
    expect(screen.getByText('Completed (1)')).toBeInTheDocument();
    
    expect(screen.getByText('Pending Task')).toBeInTheDocument();
    expect(screen.getByText('In Progress Task')).toBeInTheDocument();
    expect(screen.getByText('Completed Task')).toBeInTheDocument();
  });

  it('should handle task actions', async () => {
    const task = { 
      id: '1', 
      title: 'Test Task', 
      status: 'pending',
      totalTimeSpent: 0,
      sessionsCount: 0
    };
    
    mockTaskManager.tasks = [task];
    mockTaskManager.getPendingTasks.mockReturnValue([task]);
    mockTaskManager.getInProgressTasks.mockReturnValue([]);
    mockTaskManager.getCompletedTasks.mockReturnValue([]);
    mockTaskManager.updateTask.mockResolvedValue({ ...task, status: 'in_progress' });
    
    render(<TaskManager />);
    
    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(mockTaskManager.updateTask).toHaveBeenCalledWith('1', { status: 'in_progress' });
      expect(mockTaskManager.setActiveTask).toHaveBeenCalledWith('1');
    });
  });

  it('should highlight active task', () => {
    const task = { 
      id: '1', 
      title: 'Active Task', 
      status: 'in_progress',
      totalTimeSpent: 300,
      sessionsCount: 1
    };
    
    mockTaskManager.tasks = [task];
    mockTaskManager.activeTaskId = '1';
    mockTaskManager.getPendingTasks.mockReturnValue([]);
    mockTaskManager.getInProgressTasks.mockReturnValue([task]);
    mockTaskManager.getCompletedTasks.mockReturnValue([]);
    
    render(<TaskManager />);
    
    const activeTaskHeader = screen.getByTestId('active-task-header');
    expect(activeTaskHeader).toBeInTheDocument();
  });
});