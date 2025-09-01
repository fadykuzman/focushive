import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AutomationSection from '../AutomationSection';

describe('AutomationSection Component', () => {
  const mockOnToggle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render section title and toggle', () => {
      render(<AutomationSection autoTimerStart={false} onToggle={mockOnToggle} />);
      
      expect(screen.getByText('Automation')).toBeInTheDocument();
      expect(screen.getByText('Auto Timer Start')).toBeInTheDocument();
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('should show enabled state when autoTimerStart is true', () => {
      render(<AutomationSection autoTimerStart={true} onToggle={mockOnToggle} />);
      
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'true');
    });

    it('should show disabled state when autoTimerStart is false', () => {
      render(<AutomationSection autoTimerStart={false} onToggle={mockOnToggle} />);
      
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('Interaction', () => {
    it('should call onToggle when toggle is clicked', () => {
      render(<AutomationSection autoTimerStart={false} onToggle={mockOnToggle} />);
      
      const toggle = screen.getByRole('switch');
      fireEvent.click(toggle);
      
      expect(mockOnToggle).toHaveBeenCalledWith(true);
    });

    it('should call onToggle with opposite value', () => {
      render(<AutomationSection autoTimerStart={true} onToggle={mockOnToggle} />);
      
      const toggle = screen.getByRole('switch');
      fireEvent.click(toggle);
      
      expect(mockOnToggle).toHaveBeenCalledWith(false);
    });
  });
});