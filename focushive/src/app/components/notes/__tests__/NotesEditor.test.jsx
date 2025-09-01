import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NotesEditor from '../NotesEditor';

describe('NotesEditor', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with default props', () => {
    render(<NotesEditor onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    expect(screen.getByPlaceholderText('Note title (optional)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add your session notes...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add tags...')).toBeInTheDocument();
    expect(screen.getByText('Save Note')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should render with initial values', () => {
    render(
      <NotesEditor
        initialTitle="Test Title"
        initialContent="Test content"
        initialTags={['tag1', 'tag2']}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    
    expect(screen.getByDisplayValue('Test Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test content')).toBeInTheDocument();
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
  });

  it('should update title and content when typed', () => {
    render(<NotesEditor onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const titleInput = screen.getByPlaceholderText('Note title (optional)');
    const contentTextarea = screen.getByPlaceholderText('Add your session notes...');
    
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    fireEvent.change(contentTextarea, { target: { value: 'New content' } });
    
    expect(titleInput.value).toBe('New Title');
    expect(contentTextarea.value).toBe('New content');
  });

  it('should add tags when Enter is pressed', () => {
    render(<NotesEditor onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const tagInput = screen.getByPlaceholderText('Add tags...');
    
    fireEvent.change(tagInput, { target: { value: 'newtag' } });
    fireEvent.keyDown(tagInput, { key: 'Enter' });
    
    expect(screen.getByText('newtag')).toBeInTheDocument();
    expect(tagInput.value).toBe('');
  });

  it('should add tags when comma is pressed', () => {
    render(<NotesEditor onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const tagInput = screen.getByPlaceholderText('Add tags...');
    
    fireEvent.change(tagInput, { target: { value: 'newtag' } });
    fireEvent.keyDown(tagInput, { key: ',' });
    
    expect(screen.getByText('newtag')).toBeInTheDocument();
    expect(tagInput.value).toBe('');
  });

  it('should remove tags when clicked', () => {
    render(
      <NotesEditor
        initialTags={['tag1', 'tag2']}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    
    const removeButton = screen.getAllByText('×')[0];
    fireEvent.click(removeButton);
    
    expect(screen.queryByText('tag1')).not.toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
  });

  it('should not add duplicate tags', () => {
    render(
      <NotesEditor
        initialTags={['existing']}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    
    const tagInput = screen.getByPlaceholderText('Add tags...');
    
    fireEvent.change(tagInput, { target: { value: 'existing' } });
    fireEvent.keyDown(tagInput, { key: 'Enter' });
    
    const existingTags = screen.getAllByText('existing');
    expect(existingTags).toHaveLength(1);
  });

  it('should disable save button when no content', () => {
    render(<NotesEditor onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const saveButton = screen.getByText('Save Note');
    expect(saveButton).toBeDisabled();
  });

  it('should enable save button when content exists', () => {
    render(<NotesEditor onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const contentTextarea = screen.getByPlaceholderText('Add your session notes...');
    fireEvent.change(contentTextarea, { target: { value: 'Some content' } });
    
    const saveButton = screen.getByText('Save Note');
    expect(saveButton).not.toBeDisabled();
  });

  it('should call onSave with correct data when save button is clicked', async () => {
    render(<NotesEditor onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const titleInput = screen.getByPlaceholderText('Note title (optional)');
    const contentTextarea = screen.getByPlaceholderText('Add your session notes...');
    const tagInput = screen.getByPlaceholderText('Add tags...');
    
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(contentTextarea, { target: { value: 'Test content' } });
    fireEvent.change(tagInput, { target: { value: 'testtag' } });
    fireEvent.keyDown(tagInput, { key: 'Enter' });
    
    const saveButton = screen.getByText('Save Note');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        title: 'Test Title',
        content: 'Test content',
        tags: ['testtag']
      });
    });
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(<NotesEditor onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should save when Cmd+Enter is pressed', async () => {
    render(<NotesEditor onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const contentTextarea = screen.getByPlaceholderText('Add your session notes...');
    fireEvent.change(contentTextarea, { target: { value: 'Test content' } });
    fireEvent.keyDown(contentTextarea, { key: 'Enter', metaKey: true });
    
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled();
    });
  });

  it('should cancel when Escape is pressed', () => {
    render(<NotesEditor onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const contentTextarea = screen.getByPlaceholderText('Add your session notes...');
    fireEvent.keyDown(contentTextarea, { key: 'Escape' });
    
    expect(mockOnCancel).toHaveBeenCalled();
  });
});