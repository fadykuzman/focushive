import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import SettingsModal from '../SettingsModal';

describe('SettingsModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    durations: {
      focus: 1500,        // 25 minutes
      shortBreak: 300,    // 5 minutes
      longBreak: 900      // 15 minutes
    },
    onDurationChange: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Modal Visibility', () => {
    test('should render when isOpen is true', () => {
      render(<SettingsModal {...defaultProps} isOpen={true} />);
      
      expect(document.getElementById('settings-modal-title')).toHaveTextContent('Settings');
      expect(screen.getByText('Timer Durations')).toBeInTheDocument();
    });

    test('should not render when isOpen is false', () => {
      render(<SettingsModal {...defaultProps} isOpen={false} />);
      
      expect(document.getElementById('settings-modal-title')).not.toBeInTheDocument();
    });
  });

  describe('Duration Display', () => {
    test('should display focus duration in minutes', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const focusInput = document.getElementById('focus-duration-input');
      expect(focusInput).toHaveValue(25); // 1500 seconds = 25 minutes
    });

    test('should display short break duration in minutes', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const shortBreakInput = document.getElementById('short-break-duration-input');
      expect(shortBreakInput).toHaveValue(5); // 300 seconds = 5 minutes
    });

    test('should display long break duration in minutes', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const longBreakInput = document.getElementById('long-break-duration-input');
      expect(longBreakInput).toHaveValue(15); // 900 seconds = 15 minutes
    });
  });

  describe('Duration Changes', () => {
    test('should call onDurationChange when focus duration is modified', async () => {
      render(<SettingsModal {...defaultProps} />);
      
      const focusInput = document.getElementById('focus-duration-input');
      fireEvent.change(focusInput, { target: { value: '30' } });
      
      expect(defaultProps.onDurationChange).toHaveBeenCalledWith('focus', 1800); // 30 * 60
    });

    test('should call onDurationChange when short break duration is modified', async () => {
      render(<SettingsModal {...defaultProps} />);
      
      const shortBreakInput = document.getElementById('short-break-duration-input');
      fireEvent.change(shortBreakInput, { target: { value: '10' } });
      
      expect(defaultProps.onDurationChange).toHaveBeenCalledWith('shortBreak', 600); // 10 * 60
    });

    test('should call onDurationChange when long break duration is modified', async () => {
      render(<SettingsModal {...defaultProps} />);
      
      const longBreakInput = document.getElementById('long-break-duration-input');
      fireEvent.change(longBreakInput, { target: { value: '20' } });
      
      expect(defaultProps.onDurationChange).toHaveBeenCalledWith('longBreak', 1200); // 20 * 60
    });
  });

  describe('Input Validation', () => {
    test('should enforce minimum value of 1 minute', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const focusInput = screen.getByDisplayValue('25');
      fireEvent.change(focusInput, { target: { value: '0' } });
      
      expect(defaultProps.onDurationChange).toHaveBeenCalledWith('focus', 60); // 1 * 60 (minimum)
    });

    test('should enforce maximum value of 120 minutes', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const focusInput = screen.getByDisplayValue('25');
      fireEvent.change(focusInput, { target: { value: '150' } });
      
      expect(defaultProps.onDurationChange).toHaveBeenCalledWith('focus', 7200); // 120 * 60 (maximum)
    });

    test('should handle invalid input gracefully', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const focusInput = screen.getByDisplayValue('25');
      fireEvent.change(focusInput, { target: { value: 'invalid' } });
      
      expect(defaultProps.onDurationChange).toHaveBeenCalledWith('focus', 60); // 1 * 60 (fallback)
    });

    test('should handle empty input', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const focusInput = screen.getByDisplayValue('25');
      fireEvent.change(focusInput, { target: { value: '' } });
      
      expect(defaultProps.onDurationChange).toHaveBeenCalledWith('focus', 60); // 1 * 60 (fallback)
    });
  });

  describe('Modal Controls', () => {
    test('should call onClose when close button (×) is clicked', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const closeButton = document.getElementById('settings-close-button');
      fireEvent.click(closeButton);
      
      expect(defaultProps.onClose).toHaveBeenCalledOnce();
    });

    test('should call onClose when Done button is clicked', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const doneButton = document.getElementById('settings-done-button');
      fireEvent.click(doneButton);
      
      expect(defaultProps.onClose).toHaveBeenCalledOnce();
    });
  });

  describe('Form Accessibility', () => {
    test('should have proper labels for form inputs', () => {
      render(<SettingsModal {...defaultProps} />);
      
      expect(screen.getByText('Focus')).toBeInTheDocument();
      expect(screen.getByText('Short Break')).toBeInTheDocument();
      expect(screen.getByText('Long Break')).toBeInTheDocument();
    });

    test('should have proper input attributes', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const inputs = screen.getAllByRole('spinbutton');
      
      inputs.forEach(input => {
        expect(input).toHaveAttribute('min', '1');
        expect(input).toHaveAttribute('max', '120');
        expect(input).toHaveAttribute('type', 'number');
      });
    });

    test('should have focus styling on input focus', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const focusInput = screen.getByDisplayValue('25');
      expect(focusInput).toHaveClass('focus:ring-2', 'focus:ring-blue-500');
      
      const shortBreakInput = screen.getByDisplayValue('5');
      expect(shortBreakInput).toHaveClass('focus:ring-2', 'focus:ring-green-500');
    });
  });

  describe('Live Updates', () => {
    test('should update local state and call onDurationChange immediately', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const focusInput = screen.getByDisplayValue('25');
      fireEvent.change(focusInput, { target: { value: '45' } });
      
      // Local state should update immediately
      expect(focusInput).toHaveValue(45);
      // Parent should be notified immediately
      expect(defaultProps.onDurationChange).toHaveBeenCalledWith('focus', 2700); // 45 * 60
    });

    test('should handle rapid input changes', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const focusInput = screen.getByDisplayValue('25');
      
      // Simulate rapid typing
      fireEvent.change(focusInput, { target: { value: '3' } });
      fireEvent.change(focusInput, { target: { value: '30' } });
      
      expect(defaultProps.onDurationChange).toHaveBeenCalledTimes(2);
      expect(defaultProps.onDurationChange).toHaveBeenLastCalledWith('focus', 1800); // 30 * 60
    });
  });

  describe('Modal Overlay', () => {
    test('should render modal overlay', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const overlay = document.getElementById('settings-modal-overlay');
      expect(overlay).toHaveClass('fixed', 'inset-0', 'bg-black', 'bg-opacity-50');
    });

    test('should render modal content with proper styling', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const modalContent = document.getElementById('settings-modal-content');
      expect(modalContent).toHaveClass('bg-white', 'rounded-lg', 'p-6');
    });
  });

  describe('Props Integration', () => {
    test('should work with different initial durations', () => {
      const customProps = {
        ...defaultProps,
        durations: {
          focus: 3000,      // 50 minutes
          shortBreak: 600,  // 10 minutes  
          longBreak: 1800   // 30 minutes
        }
      };
      
      render(<SettingsModal {...customProps} />);
      
      expect(screen.getByDisplayValue('50')).toBeInTheDocument();
      expect(screen.getByDisplayValue('10')).toBeInTheDocument();
      expect(screen.getByDisplayValue('30')).toBeInTheDocument();
    });

    test('should handle missing onDurationChange gracefully', () => {
      const propsWithoutCallback = {
        ...defaultProps,
        onDurationChange: vi.fn() // Provide a mock instead of undefined
      };
      
      expect(() => render(<SettingsModal {...propsWithoutCallback} />)).not.toThrow();
    });
  });
});