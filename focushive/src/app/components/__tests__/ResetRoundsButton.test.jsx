import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ResetRoundsButton from '../ResetRoundsButton';

describe('ResetRoundsButton Component', () => {
  const mockResetRounds = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Button Rendering', () => {
    it('should render reset rounds button with correct text', () => {
      render(<ResetRoundsButton resetRounds={mockResetRounds} mode="focus" />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('⟲');
    });

    it('should have proper title attribute', () => {
      render(<ResetRoundsButton resetRounds={mockResetRounds} mode="focus" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'Reset Rounds (Back to Round 1)');
    });
  });

  describe('Click Behavior', () => {
    it('should call resetRounds when clicked', () => {
      render(<ResetRoundsButton resetRounds={mockResetRounds} mode="focus" />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockResetRounds).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple clicks', () => {
      render(<ResetRoundsButton resetRounds={mockResetRounds} mode="focus" />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(mockResetRounds).toHaveBeenCalledTimes(3);
    });
  });

  describe('Mode-Based Styling', () => {
    it('should apply focus mode styling', () => {
      render(<ResetRoundsButton resetRounds={mockResetRounds} mode="focus" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-white/70');
      expect(button).toHaveClass('hover:text-white');
    });

    it('should apply short break mode styling', () => {
      render(<ResetRoundsButton resetRounds={mockResetRounds} mode="shortBreak" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-white/70');
      expect(button).toHaveClass('hover:text-white');
    });

    it('should apply long break mode styling', () => {
      render(<ResetRoundsButton resetRounds={mockResetRounds} mode="longBreak" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-white/70');
      expect(button).toHaveClass('hover:text-white');
    });

    it('should apply default styling for unknown mode', () => {
      render(<ResetRoundsButton resetRounds={mockResetRounds} mode="unknown" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-white/70');
      expect(button).toHaveClass('hover:text-white');
    });
  });

  describe('Accessibility', () => {
    it('should be focusable', () => {
      render(<ResetRoundsButton resetRounds={mockResetRounds} mode="focus" />);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('should have proper button role', () => {
      render(<ResetRoundsButton resetRounds={mockResetRounds} mode="focus" />);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Props Validation', () => {
    it('should handle missing props gracefully', () => {
      expect(() => {
        render(<ResetRoundsButton />);
      }).not.toThrow();
    });

    it('should work with all timer modes', () => {
      const modes = ['focus', 'shortBreak', 'longBreak'];
      
      modes.forEach(mode => {
        const { unmount } = render(<ResetRoundsButton resetRounds={mockResetRounds} mode={mode} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
        unmount();
      });
    });
  });
});