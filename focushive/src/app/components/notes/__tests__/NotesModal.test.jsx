import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import NotesModal from '../NotesModal';

vi.mock('../../../utils/notesDatabase', () => ({
  notesDatabase: {
    getNotesBySession: vi.fn(() => Promise.resolve([])),
    getNotesByTask: vi.fn(() => Promise.resolve([])),
    getAllNotes: vi.fn(() => Promise.resolve([])),
    getAllTags: vi.fn(() => Promise.resolve([])),
    addNote: vi.fn(() => Promise.resolve({})),
    updateNote: vi.fn(() => Promise.resolve({})),
    deleteNote: vi.fn(() => Promise.resolve()),
    exportNotesAsMarkdown: vi.fn(() => Promise.resolve('# Notes')),
    exportNotesAsText: vi.fn(() => Promise.resolve('Notes'))
  }
}));

vi.mock('../../utils/modalUtils', () => ({
  useClickOutside: vi.fn(() => vi.fn()),
  useEscapeKey: vi.fn()
}));

vi.mock('../NotesEditor', () => ({
  default: () => <div data-testid="notes-editor">Notes Editor</div>
}));

vi.mock('../NotesList', () => ({
  default: ({ notes }) => (
    <div data-testid="notes-list">
      {notes.length === 0 ? 'No notes yet' : `${notes.length} notes`}
    </div>
  )
}));

vi.mock('../NotesSearch', () => ({
  default: () => <div data-testid="notes-search">Search Component</div>
}));

describe('NotesModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when closed', () => {
    const { container } = render(<NotesModal {...defaultProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render with default title', () => {
    render(<NotesModal {...defaultProps} />);
    expect(screen.getByText('Focus Session Notes')).toBeInTheDocument();
  });

  it('should render with session title when sessionId provided', () => {
    render(<NotesModal {...defaultProps} sessionId="session123" />);
    expect(screen.getByText('Session Notes')).toBeInTheDocument();
  });

  it('should render with task title when taskId provided', () => {
    render(<NotesModal {...defaultProps} taskId="task456" />);
    expect(screen.getByText('Task Notes')).toBeInTheDocument();
  });

  it('should render main components', async () => {
    render(<NotesModal {...defaultProps} />);
    
    expect(screen.getByText('Add Note')).toBeInTheDocument();
    expect(screen.getByTestId('notes-search')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByTestId('notes-list')).toBeInTheDocument();
    });
  });
});