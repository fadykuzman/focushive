import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ToggleSwitch from '../ToggleSwitch';

describe('ToggleSwitch Component', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render toggle switch', () => {
      render(<ToggleSwitch label="Test toggle" />);
      
      const toggle = screen.getByRole('switch');
      expect(toggle).toBeInTheDocument();
    });

    it('should have proper ARIA attributes', () => {
      render(<ToggleSwitch enabled={true} label="Test toggle" />);
      
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'true');
      expect(toggle).toHaveAttribute('aria-label', 'Test toggle');
    });

    it('should show disabled state when disabled prop is true', () => {
      render(<ToggleSwitch disabled={true} label="Test toggle" />);
      
      const toggle = screen.getByRole('switch');
      expect(toggle).toBeDisabled();
      expect(toggle).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Visual States', () => {
    it('should apply enabled styling when enabled', () => {
      render(<ToggleSwitch enabled={true} />);
      
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveClass('bg-primary-600');
    });

    it('should apply disabled styling when disabled', () => {
      render(<ToggleSwitch disabled={true} />);
      
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveClass('bg-gray-200');
      expect(toggle).toHaveClass('cursor-not-allowed');
    });

    it('should position switch knob correctly when enabled', () => {
      render(<ToggleSwitch enabled={true} />);
      
      const knob = screen.getByRole('switch').querySelector('span');
      expect(knob).toHaveClass('translate-x-6');
    });

    it('should position switch knob correctly when disabled', () => {
      render(<ToggleSwitch enabled={false} />);
      
      const knob = screen.getByRole('switch').querySelector('span');
      expect(knob).toHaveClass('translate-x-1');
    });
  });

  describe('Interaction', () => {
    it('should call onChange when clicked and not disabled', () => {
      render(<ToggleSwitch enabled={false} onChange={mockOnChange} />);
      
      const toggle = screen.getByRole('switch');
      fireEvent.click(toggle);
      
      expect(mockOnChange).toHaveBeenCalledWith(true);
    });

    it('should not call onChange when disabled', () => {
      render(<ToggleSwitch disabled={true} onChange={mockOnChange} />);
      
      const toggle = screen.getByRole('switch');
      fireEvent.click(toggle);
      
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should toggle from enabled to disabled', () => {
      render(<ToggleSwitch enabled={true} onChange={mockOnChange} />);
      
      const toggle = screen.getByRole('switch');
      fireEvent.click(toggle);
      
      expect(mockOnChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Default Props', () => {
    it('should work without onChange handler', () => {
      expect(() => {
        render(<ToggleSwitch />);
      }).not.toThrow();
    });

    it('should default to disabled state', () => {
      render(<ToggleSwitch />);
      
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'false');
    });
  });
});