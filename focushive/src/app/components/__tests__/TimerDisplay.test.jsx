import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import TimerDisplay from '../TimerDisplay';

// Mock child components to focus on TimerDisplay composition logic
vi.mock('../ProgressRing', () => ({
  default: ({ progress }) => (
    <div data-testid="progress-ring" data-progress={progress}>
      Progress Ring: {progress}%
    </div>
  )
}));

vi.mock('../TimeDisplay', () => ({
  default: ({ timeLeft }) => (
    <div data-testid="time-display" data-time={timeLeft}>
      Time: {timeLeft}s
    </div>
  )
}));

describe('TimerDisplay Component', () => {
  describe('Component Composition', () => {
    test('should render both ProgressRing and TimeDisplay components', () => {
      render(<TimerDisplay timeLeft={1500} progress={25} />);
      
      expect(screen.getByTestId('progress-ring')).toBeInTheDocument();
      expect(screen.getByTestId('time-display')).toBeInTheDocument();
    });

    test('should pass timeLeft prop to TimeDisplay', () => {
      render(<TimerDisplay timeLeft={900} progress={40} />);
      
      const timeDisplay = screen.getByTestId('time-display');
      expect(timeDisplay).toHaveAttribute('data-time', '900');
      expect(timeDisplay).toHaveTextContent('Time: 900s');
    });

    test('should pass progress prop to ProgressRing', () => {
      render(<TimerDisplay timeLeft={1200} progress={60} />);
      
      const progressRing = screen.getByTestId('progress-ring');
      expect(progressRing).toHaveAttribute('data-progress', '60');
      expect(progressRing).toHaveTextContent('Progress Ring: 60%');
    });
  });

  describe('Layout Structure', () => {
    test('should have proper container layout classes', () => {
      render(<TimerDisplay timeLeft={1500} progress={50} />);
      
      const container = screen.getByTestId('progress-ring').parentElement;
      expect(container).toHaveClass('relative', 'w-64', 'h-64', 'mx-auto', 'mb-8');
    });

    test('should maintain consistent container dimensions', () => {
      const { rerender } = render(<TimerDisplay timeLeft={1500} progress={0} />);
      const container = screen.getByTestId('progress-ring').parentElement;
      const initialClasses = container.className;
      
      // Re-render with different props
      rerender(<TimerDisplay timeLeft={300} progress={100} />);
      expect(container.className).toBe(initialClasses);
    });
  });

  describe('Props Handling', () => {
    test('should handle zero timeLeft', () => {
      render(<TimerDisplay timeLeft={0} progress={100} />);
      
      expect(screen.getByTestId('time-display')).toHaveAttribute('data-time', '0');
      expect(screen.getByTestId('progress-ring')).toHaveAttribute('data-progress', '100');
    });

    test('should handle large timeLeft values', () => {
      render(<TimerDisplay timeLeft={7200} progress={0} />);
      
      expect(screen.getByTestId('time-display')).toHaveAttribute('data-time', '7200');
      expect(screen.getByTestId('progress-ring')).toHaveAttribute('data-progress', '0');
    });

    test('should handle decimal progress values', () => {
      render(<TimerDisplay timeLeft={1000} progress={33.333} />);
      
      expect(screen.getByTestId('progress-ring')).toHaveAttribute('data-progress', '33.333');
    });

    test('should handle negative progress values', () => {
      render(<TimerDisplay timeLeft={1500} progress={-5} />);
      
      expect(screen.getByTestId('progress-ring')).toHaveAttribute('data-progress', '-5');
    });

    test('should handle progress values over 100', () => {
      render(<TimerDisplay timeLeft={500} progress={150} />);
      
      expect(screen.getByTestId('progress-ring')).toHaveAttribute('data-progress', '150');
    });
  });

  describe('Component Integration', () => {
    test('should update child components when props change', () => {
      const { rerender } = render(<TimerDisplay timeLeft={1500} progress={25} />);
      
      // Initial state
      expect(screen.getByTestId('time-display')).toHaveAttribute('data-time', '1500');
      expect(screen.getByTestId('progress-ring')).toHaveAttribute('data-progress', '25');
      
      // Update props
      rerender(<TimerDisplay timeLeft={750} progress={50} />);
      
      expect(screen.getByTestId('time-display')).toHaveAttribute('data-time', '750');
      expect(screen.getByTestId('progress-ring')).toHaveAttribute('data-progress', '50');
    });

    test('should maintain component hierarchy', () => {
      render(<TimerDisplay timeLeft={1200} progress={75} />);
      
      const container = screen.getByTestId('progress-ring').parentElement;
      const progressRing = screen.getByTestId('progress-ring');
      const timeDisplay = screen.getByTestId('time-display');
      
      // Both components should be children of the same container
      expect(container).toContainElement(progressRing);
      expect(container).toContainElement(timeDisplay);
    });
  });

  describe('Edge Cases', () => {
    test('should handle undefined props gracefully', () => {
      expect(() => render(<TimerDisplay />)).not.toThrow();
    });

    test('should handle null props gracefully', () => {
      expect(() => render(<TimerDisplay timeLeft={null} progress={null} />)).not.toThrow();
    });

    test('should handle string props that can be converted to numbers', () => {
      render(<TimerDisplay timeLeft="1500" progress="25" />);
      
      expect(screen.getByTestId('time-display')).toHaveAttribute('data-time', '1500');
      expect(screen.getByTestId('progress-ring')).toHaveAttribute('data-progress', '25');
    });
  });

  describe('Accessibility', () => {
    test('should have proper container structure for screen readers', () => {
      render(<TimerDisplay timeLeft={1500} progress={50} />);
      
      const container = screen.getByTestId('progress-ring').parentElement;
      
      // Container should be properly structured for accessibility
      expect(container).toBeInTheDocument();
      expect(container.tagName).toBe('DIV');
    });

    test('should maintain focus order within container', () => {
      render(<TimerDisplay timeLeft={1500} progress={50} />);
      
      const progressRing = screen.getByTestId('progress-ring');
      const timeDisplay = screen.getByTestId('time-display');
      
      // Components should be in logical DOM order
      expect(progressRing.compareDocumentPosition(timeDisplay)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      );
    });
  });
});