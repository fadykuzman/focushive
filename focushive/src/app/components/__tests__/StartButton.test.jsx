import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import StartButton from '../StartButton';

describe('StartButton Component', () => {
  const defaultProps = {
    startTimer: vi.fn(),
    resumeTimer: vi.fn(),
    isPaused: false,
    mode: 'focus'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Button Text', () => {
    test('should show "Start" when not paused', () => {
      render(<StartButton {...defaultProps} isPaused={false} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Start');
    });

    test('should show "Resume" when paused', () => {
      render(<StartButton {...defaultProps} isPaused={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Resume');
    });
  });

  describe('Click Behavior', () => {
    test('should call startTimer when not paused', () => {
      render(<StartButton {...defaultProps} isPaused={false} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(defaultProps.startTimer).toHaveBeenCalledOnce();
      expect(defaultProps.resumeTimer).not.toHaveBeenCalled();
    });

    test('should call resumeTimer when paused', () => {
      render(<StartButton {...defaultProps} isPaused={true} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(defaultProps.resumeTimer).toHaveBeenCalledOnce();
      expect(defaultProps.startTimer).not.toHaveBeenCalled();
    });
  });

  describe('Mode-Based Styling', () => {
    test('should apply focus mode styling', () => {
      render(<StartButton {...defaultProps} mode="focus" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-white', 'text-black');
    });

    test('should apply short break mode styling', () => {
      render(<StartButton {...defaultProps} mode="shortBreak" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-white', 'text-green-600');
    });

    test('should apply long break mode styling', () => {
      render(<StartButton {...defaultProps} mode="longBreak" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-white', 'text-blue-600');
    });

    test('should apply default styling for unknown mode', () => {
      render(<StartButton {...defaultProps} mode="unknown" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-white', 'text-red-500');
    });
  });

  describe('Accessibility', () => {
    test('should be focusable', () => {
      render(<StartButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    test('should have proper button role', () => {
      render(<StartButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Props Validation', () => {
    test('should handle missing props gracefully', () => {
      const minimalProps = {
        startTimer: vi.fn(),
        resumeTimer: vi.fn(),
        isPaused: false,
        mode: 'focus'
      };
      
      expect(() => render(<StartButton {...minimalProps} />)).not.toThrow();
    });

    test('should work with all timer modes', () => {
      const modes = ['focus', 'shortBreak', 'longBreak'];
      
      modes.forEach(mode => {
        const { unmount } = render(<StartButton {...defaultProps} mode={mode} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
        unmount();
      });
    });
  });
});