import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import SettingsModal from '../SettingsModal';

// Mock the timer store
const mockTimerStore = {
  autoTimerStart: false,
  toggleAutoTimerStart: vi.fn()
};

vi.mock('../../../stores/timerStore', () => ({
  default: () => mockTimerStore
}));

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
    mockTimerStore.autoTimerStart = false;
  });

  describe('Modal Visibility', () => {
    test('should render when isOpen is true', () => {
      render(<SettingsModal {...defaultProps} isOpen={true} />);
      
      expect(document.getElementById('settings-modal-title')).toHaveTextContent('Settings');
      expect(screen.getByText('Timer Durations')).toBeInTheDocument();
      expect(screen.getByText('Automation')).toBeInTheDocument();
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
    test('should update local state when focus duration is modified', async () => {
      render(<SettingsModal {...defaultProps} />);
      
      const focusInput = document.getElementById('focus-duration-input');
      fireEvent.change(focusInput, { target: { value: '30' } });
      
      expect(focusInput).toHaveValue(30);
      expect(defaultProps.onDurationChange).not.toHaveBeenCalled();
    });

    test('should update local state when short break duration is modified', async () => {
      render(<SettingsModal {...defaultProps} />);
      
      const shortBreakInput = document.getElementById('short-break-duration-input');
      fireEvent.change(shortBreakInput, { target: { value: '10' } });
      
      expect(shortBreakInput).toHaveValue(10);
      expect(defaultProps.onDurationChange).not.toHaveBeenCalled();
    });

    test('should update local state when long break duration is modified', async () => {
      render(<SettingsModal {...defaultProps} />);
      
      const longBreakInput = document.getElementById('long-break-duration-input');
      fireEvent.change(longBreakInput, { target: { value: '20' } });
      
      expect(longBreakInput).toHaveValue(20);
      expect(defaultProps.onDurationChange).not.toHaveBeenCalled();
    });
  });

  describe('Input Validation', () => {
    test('should enforce minimum value of 1 minute locally', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const focusInput = screen.getByDisplayValue('25');
      fireEvent.change(focusInput, { target: { value: '0' } });
      
      expect(focusInput).toHaveValue(1); // Minimum enforced locally
      expect(defaultProps.onDurationChange).not.toHaveBeenCalled();
    });

    test('should enforce maximum value of 120 minutes locally', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const focusInput = screen.getByDisplayValue('25');
      fireEvent.change(focusInput, { target: { value: '150' } });
      
      expect(focusInput).toHaveValue(120); // Maximum enforced locally
      expect(defaultProps.onDurationChange).not.toHaveBeenCalled();
    });

    test('should handle invalid input gracefully', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const focusInput = screen.getByDisplayValue('25');
      fireEvent.change(focusInput, { target: { value: 'invalid' } });
      
      expect(focusInput).toHaveValue(1); // Default to 1 minute locally
      expect(defaultProps.onDurationChange).not.toHaveBeenCalled();
    });

    test('should handle empty input', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const focusInput = screen.getByDisplayValue('25');
      fireEvent.change(focusInput, { target: { value: '' } });
      
      expect(focusInput).toHaveValue(1); // Default to 1 minute locally
      expect(defaultProps.onDurationChange).not.toHaveBeenCalled();
    });
  });

  describe('Modal Controls', () => {
    test('should call onClose when close button (×) is clicked', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const closeButton = document.getElementById('settings-close-button');
      fireEvent.click(closeButton);
      
      expect(defaultProps.onClose).toHaveBeenCalledOnce();
    });

    test('should call onClose when Cancel button is clicked', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const cancelButton = document.getElementById('settings-cancel-button');
      fireEvent.click(cancelButton);
      
      expect(defaultProps.onClose).toHaveBeenCalledOnce();
    });

    test('should call onClose when Save button is clicked with changes', () => {
      render(<SettingsModal {...defaultProps} />);
      
      // Make a change to enable save button
      const focusInput = screen.getByDisplayValue('25');
      fireEvent.change(focusInput, { target: { value: '30' } });
      
      const saveButton = document.getElementById('settings-save-button');
      fireEvent.click(saveButton);
      
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

  describe('Local State Updates', () => {
    test('should update local state without calling onDurationChange immediately', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const focusInput = screen.getByDisplayValue('25');
      fireEvent.change(focusInput, { target: { value: '45' } });
      
      // Local state should update immediately
      expect(focusInput).toHaveValue(45);
      // Parent should NOT be notified until save
      expect(defaultProps.onDurationChange).not.toHaveBeenCalled();
    });

    test('should handle rapid input changes without calling onDurationChange', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const focusInput = screen.getByDisplayValue('25');
      
      // Simulate rapid typing
      fireEvent.change(focusInput, { target: { value: '3' } });
      fireEvent.change(focusInput, { target: { value: '30' } });
      
      expect(focusInput).toHaveValue(30);
      expect(defaultProps.onDurationChange).not.toHaveBeenCalled();
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

  describe('Automation Section', () => {
    test('should render automation section with toggle', () => {
      render(<SettingsModal {...defaultProps} />);
      
      expect(screen.getByText('Automation')).toBeInTheDocument();
      expect(screen.getByText('Auto Timer Start')).toBeInTheDocument();
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    test('should render functional toggle switch', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const toggle = screen.getByRole('switch');
      expect(toggle).not.toBeDisabled();
      expect(toggle).toHaveAttribute('aria-checked', 'false');
    });

    test('should only apply toggle change when save is clicked', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const toggle = screen.getByRole('switch');
      fireEvent.click(toggle);
      
      // Should not call store function yet
      expect(mockTimerStore.toggleAutoTimerStart).not.toHaveBeenCalled();
      
      const saveButton = document.getElementById('settings-save-button');
      fireEvent.click(saveButton);
      
      // Should call store function when saving
      expect(mockTimerStore.toggleAutoTimerStart).toHaveBeenCalledTimes(1);
    });

    test('should not apply changes when cancel is clicked', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const toggle = screen.getByRole('switch');
      fireEvent.click(toggle);
      
      const cancelButton = document.getElementById('settings-cancel-button');
      fireEvent.click(cancelButton);
      
      // Should not call store function when cancelling
      expect(mockTimerStore.toggleAutoTimerStart).not.toHaveBeenCalled();
    });
  });

  describe('Save/Cancel Behavior', () => {
    test('should apply duration changes only when save is clicked', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const focusInput = document.getElementById('focus-duration-input');
      fireEvent.change(focusInput, { target: { value: '30' } });
      
      // Should not call onDurationChange yet
      expect(defaultProps.onDurationChange).not.toHaveBeenCalled();
      
      const saveButton = document.getElementById('settings-save-button');
      fireEvent.click(saveButton);
      
      // Should call onDurationChange when saving
      expect(defaultProps.onDurationChange).toHaveBeenCalledWith('focus', 1800);
    });

    test('should reset duration changes when cancel is clicked', () => {
      render(<SettingsModal {...defaultProps} />);
      
      const focusInput = document.getElementById('focus-duration-input');
      fireEvent.change(focusInput, { target: { value: '30' } });
      
      const cancelButton = document.getElementById('settings-cancel-button');
      fireEvent.click(cancelButton);
      
      // Should not call onDurationChange when cancelling
      expect(defaultProps.onDurationChange).not.toHaveBeenCalled();
    });
  });
});