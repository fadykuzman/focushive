import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ModeSwitch from '../ModeSwitch';

describe('ModeSwitch Component', () => {
  const defaultProps = {
    mode: 'focus',
    switchMode: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Button Rendering', () => {
    test('should render all three mode buttons', () => {
      render(<ModeSwitch {...defaultProps} />);
      
      expect(screen.getByText('Focus')).toBeInTheDocument();
      expect(screen.getByText('Short Break')).toBeInTheDocument();
      expect(screen.getByText('Long Break')).toBeInTheDocument();
    });

    test('should render buttons as clickable elements', () => {
      render(<ModeSwitch {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });
  });

  describe('Active Mode Styling', () => {
    test('should highlight focus button when focus mode is active', () => {
      render(<ModeSwitch {...defaultProps} mode="focus" />);
      
      const focusButton = document.getElementById('focus-mode-button');
      expect(focusButton).toHaveClass('bg-white', 'text-black', 'font-bold');
      
      const shortBreakButton = document.getElementById('short-break-mode-button');
      expect(shortBreakButton).not.toHaveClass('bg-white');
    });

    test('should highlight short break button when short break mode is active', () => {
      render(<ModeSwitch {...defaultProps} mode="shortBreak" />);
      
      const shortBreakButton = document.getElementById('short-break-mode-button');
      expect(shortBreakButton).toHaveClass('bg-white', 'text-green-600', 'font-bold');
      
      const focusButton = document.getElementById('focus-mode-button');
      expect(focusButton).not.toHaveClass('bg-white');
    });

    test('should highlight long break button when long break mode is active', () => {
      render(<ModeSwitch {...defaultProps} mode="longBreak" />);
      
      const longBreakButton = document.getElementById('long-break-mode-button');
      expect(longBreakButton).toHaveClass('bg-white', 'text-blue-600', 'font-bold');
      
      const focusButton = document.getElementById('focus-mode-button');
      expect(focusButton).not.toHaveClass('bg-white');
    });
  });

  describe('Inactive Mode Styling', () => {
    test('should apply inactive styling to non-selected focus button', () => {
      render(<ModeSwitch {...defaultProps} mode="shortBreak" />);
      
      const focusButton = document.getElementById('focus-mode-button');
      expect(focusButton).toHaveClass('bg-black-700', 'text-gray-300');
      expect(focusButton).not.toHaveClass('bg-white');
    });

    test('should apply inactive styling to non-selected short break button', () => {
      render(<ModeSwitch {...defaultProps} mode="focus" />);
      
      const shortBreakButton = document.getElementById('short-break-mode-button');
      expect(shortBreakButton).toHaveClass('bg-green-700', 'text-green-300');
      expect(shortBreakButton).not.toHaveClass('bg-white');
    });

    test('should apply inactive styling to non-selected long break button', () => {
      render(<ModeSwitch {...defaultProps} mode="focus" />);
      
      const longBreakButton = document.getElementById('long-break-mode-button');
      expect(longBreakButton).toHaveClass('bg-blue-700', 'text-blue-300');
      expect(longBreakButton).not.toHaveClass('bg-white');
    });
  });

  describe('Mode Switching', () => {
    test('should call switchMode with focus when focus button is clicked', () => {
      render(<ModeSwitch {...defaultProps} mode="shortBreak" />);
      
      const focusButton = document.getElementById('focus-mode-button');
      fireEvent.click(focusButton);
      
      expect(defaultProps.switchMode).toHaveBeenCalledWith('focus');
    });

    test('should call switchMode with shortBreak when short break button is clicked', () => {
      render(<ModeSwitch {...defaultProps} mode="focus" />);
      
      const shortBreakButton = document.getElementById('short-break-mode-button');
      fireEvent.click(shortBreakButton);
      
      expect(defaultProps.switchMode).toHaveBeenCalledWith('shortBreak');
    });

    test('should call switchMode with longBreak when long break button is clicked', () => {
      render(<ModeSwitch {...defaultProps} mode="focus" />);
      
      const longBreakButton = document.getElementById('long-break-mode-button');
      fireEvent.click(longBreakButton);
      
      expect(defaultProps.switchMode).toHaveBeenCalledWith('longBreak');
    });

    test('should allow switching to currently active mode', () => {
      render(<ModeSwitch {...defaultProps} mode="focus" />);
      
      const focusButton = document.getElementById('focus-mode-button');
      fireEvent.click(focusButton);
      
      expect(defaultProps.switchMode).toHaveBeenCalledWith('focus');
    });
  });

  describe('Edge Cases', () => {
    test('should handle unknown mode gracefully', () => {
      render(<ModeSwitch {...defaultProps} mode="unknown" />);
      
      // Should render all buttons without crashing
      expect(screen.getByText('Focus')).toBeInTheDocument();
      expect(screen.getByText('Short Break')).toBeInTheDocument();
      expect(screen.getByText('Long Break')).toBeInTheDocument();
    });

    test('should handle missing mode prop', () => {
      const propsWithoutMode = { switchMode: vi.fn() };
      
      expect(() => render(<ModeSwitch {...propsWithoutMode} />)).not.toThrow();
    });

    test('should handle missing switchMode prop', () => {
      const propsWithoutSwitch = { mode: 'focus' };
      
      expect(() => render(<ModeSwitch {...propsWithoutSwitch} />)).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    test('should have proper button roles', () => {
      render(<ModeSwitch {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
      
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });

    test('should be keyboard accessible', () => {
      render(<ModeSwitch {...defaultProps} />);
      
      const focusButton = document.getElementById('focus-mode-button');
      focusButton.focus();
      expect(focusButton).toHaveFocus();
      
      // Test keyboard activation (buttons respond to click, not keyDown by default)
      fireEvent.click(focusButton);
      expect(defaultProps.switchMode).toHaveBeenCalledWith('focus');
    });

    test('should have proper button styling for accessibility', () => {
      render(<ModeSwitch {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('transition-all'); // Visual feedback
        expect(button).toHaveClass('rounded-lg');     // Proper touch targets
      });
    });
  });

  describe('State Consistency', () => {
    test('should only highlight one button at a time', () => {
      render(<ModeSwitch {...defaultProps} mode="focus" />);
      
      const focusButton = document.getElementById('focus-mode-button');
      const shortBreakButton = document.getElementById('short-break-mode-button');
      const longBreakButton = document.getElementById('long-break-mode-button');
      
      // Only focus should be highlighted
      expect(focusButton).toHaveClass('bg-white');
      expect(shortBreakButton).not.toHaveClass('bg-white');
      expect(longBreakButton).not.toHaveClass('bg-white');
    });

    test('should update highlighting when mode prop changes', () => {
      const { rerender } = render(<ModeSwitch {...defaultProps} mode="focus" />);
      
      let focusButton = document.getElementById('focus-mode-button');
      let shortBreakButton = document.getElementById('short-break-mode-button');
      expect(focusButton).toHaveClass('bg-white');
      expect(shortBreakButton).not.toHaveClass('bg-white');
      
      // Change mode
      rerender(<ModeSwitch {...defaultProps} mode="shortBreak" />);
      
      focusButton = document.getElementById('focus-mode-button');
      shortBreakButton = document.getElementById('short-break-mode-button');
      expect(focusButton).not.toHaveClass('bg-white');
      expect(shortBreakButton).toHaveClass('bg-white');
    });
  });
});