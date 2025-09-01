import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskSelector from '../TaskSelector';

const mockTaskManager = {
  tasks: [],
  getActiveTask: vi.fn(),
  setActiveTask: vi.fn(),
  clearActiveTask: vi.fn()
};

vi.mock('../../../hooks/useTaskManager', () => ({
  useTaskManager: () => mockTaskManager
}));

describe('TaskSelector', () => {
  const mockOnTaskSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockTaskManager.tasks = [];
    mockTaskManager.getActiveTask.mockReturnValue(null);
  });

  it('should render with no task selected by default', () => {
    render(<TaskSelector onTaskSelect={mockOnTaskSelect} />);
    
    expect(screen.getByDisplayValue('No task selected')).toBeInTheDocument();
  });

  it('should display available tasks for selection', () => {
    mockTaskManager.tasks = [
      { id: '1', title: 'Pending Task', status: 'pending' },
      { id: '2', title: 'In Progress Task', status: 'in_progress' },
      { id: '3', title: 'Completed Task', status: 'completed' }
    ];
    
    render(<TaskSelector onTaskSelect={mockOnTaskSelect} />);
    
    expect(screen.getByText('Pending Task (Pending)')).toBeInTheDocument();
    expect(screen.getByText('In Progress Task (In Progress)')).toBeInTheDocument();
    expect(screen.queryByText('Completed Task')).not.toBeInTheDocument();
  });

  it('should call onTaskSelect when task is selected', () => {
    const task = { id: '1', title: 'Test Task', status: 'pending' };
    mockTaskManager.tasks = [task];
    
    render(<TaskSelector onTaskSelect={mockOnTaskSelect} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '1' } });
    
    expect(mockTaskManager.setActiveTask).toHaveBeenCalledWith('1');
    expect(mockOnTaskSelect).toHaveBeenCalledWith(task);
  });

  it('should clear task selection when "No task selected" is chosen', () => {
    const task = { id: '1', title: 'Test Task', status: 'pending' };
    mockTaskManager.tasks = [task];
    
    render(<TaskSelector onTaskSelect={mockOnTaskSelect} selectedTaskId="1" />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '' } });
    
    expect(mockTaskManager.clearActiveTask).toHaveBeenCalled();
    expect(mockOnTaskSelect).toHaveBeenCalledWith(null);
  });

  it('should show active task details when task is selected', () => {
    const activeTask = {
      id: '1',
      title: 'Active Task',
      description: 'Task description',
      status: 'in_progress',
      totalTimeSpent: 1800,
      sessionsCount: 3
    };
    
    mockTaskManager.tasks = [activeTask];
    mockTaskManager.getActiveTask.mockReturnValue(activeTask);
    
    render(<TaskSelector onTaskSelect={mockOnTaskSelect} selectedTaskId="1" />);
    
    expect(screen.getByText('Active Task')).toBeInTheDocument();
    expect(screen.getByText('Task description')).toBeInTheDocument();
    expect(screen.getByText(/Time spent: 30m/)).toBeInTheDocument();
    expect(screen.getByText(/Sessions: 3/)).toBeInTheDocument();
  });
});