import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ModalButtons from '../ModalButtons';

describe('ModalButtons Component', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render save and cancel buttons', () => {
      render(<ModalButtons onSave={mockOnSave} onCancel={mockOnCancel} />);
      
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should disable save button when not dirty', () => {
      render(<ModalButtons onSave={mockOnSave} onCancel={mockOnCancel} isDirty={false} />);
      
      const saveButton = document.getElementById('settings-save-button');
      expect(saveButton).toBeDisabled();
      expect(saveButton).toHaveClass('bg-gray-400', 'cursor-not-allowed');
    });

    it('should enable save button when dirty', () => {
      render(<ModalButtons onSave={mockOnSave} onCancel={mockOnCancel} isDirty={true} />);
      
      const saveButton = document.getElementById('settings-save-button');
      expect(saveButton).not.toBeDisabled();
      expect(saveButton).toHaveClass('bg-primary-600');
    });
  });

  describe('Interaction', () => {
    it('should call onCancel when cancel button is clicked', () => {
      render(<ModalButtons onSave={mockOnSave} onCancel={mockOnCancel} />);
      
      const cancelButton = document.getElementById('settings-cancel-button');
      fireEvent.click(cancelButton);
      
      expect(mockOnCancel).toHaveBeenCalledOnce();
    });

    it('should call onSave when save button is clicked and enabled', () => {
      render(<ModalButtons onSave={mockOnSave} onCancel={mockOnCancel} isDirty={true} />);
      
      const saveButton = document.getElementById('settings-save-button');
      fireEvent.click(saveButton);
      
      expect(mockOnSave).toHaveBeenCalledOnce();
    });

    it('should not call onSave when save button is disabled', () => {
      render(<ModalButtons onSave={mockOnSave} onCancel={mockOnCancel} isDirty={false} />);
      
      const saveButton = document.getElementById('settings-save-button');
      fireEvent.click(saveButton);
      
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  describe('Default Props', () => {
    it('should default isDirty to false', () => {
      render(<ModalButtons onSave={mockOnSave} onCancel={mockOnCancel} />);
      
      const saveButton = document.getElementById('settings-save-button');
      expect(saveButton).toBeDisabled();
    });
  });
});