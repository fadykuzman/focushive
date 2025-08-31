import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DurationInputGroup from '../DurationInputGroup';

describe('DurationInputGroup Component', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render label and input', () => {
      render(
        <DurationInputGroup 
          label="Focus"
          value={25}
          onChange={mockOnChange}
          inputId="test-input"
        />
      );
      
      expect(screen.getByText('Focus')).toBeInTheDocument();
      expect(screen.getByDisplayValue('25')).toBeInTheDocument();
      expect(screen.getByText('min')).toBeInTheDocument();
    });

    it('should apply correct input id', () => {
      render(
        <DurationInputGroup 
          label="Focus"
          value={25}
          onChange={mockOnChange}
          inputId="focus-input"
        />
      );
      
      const input = document.getElementById('focus-input');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Focus Colors', () => {
    it('should apply blue focus color by default', () => {
      render(
        <DurationInputGroup 
          label="Focus"
          value={25}
          onChange={mockOnChange}
          inputId="test-input"
        />
      );
      
      const input = screen.getByDisplayValue('25');
      expect(input).toHaveClass('focus:ring-blue-500');
    });

    it('should apply green focus color when specified', () => {
      render(
        <DurationInputGroup 
          label="Short Break"
          value={5}
          onChange={mockOnChange}
          inputId="test-input"
          focusColor="green"
        />
      );
      
      const input = screen.getByDisplayValue('5');
      expect(input).toHaveClass('focus:ring-green-500');
    });
  });

  describe('Interaction', () => {
    it('should call onChange when input value changes', () => {
      render(
        <DurationInputGroup 
          label="Focus"
          value={25}
          onChange={mockOnChange}
          inputId="test-input"
        />
      );
      
      const input = screen.getByDisplayValue('25');
      fireEvent.change(input, { target: { value: '30' } });
      
      expect(mockOnChange).toHaveBeenCalledWith('30');
    });
  });

  describe('Accessibility', () => {
    it('should have proper input attributes', () => {
      render(
        <DurationInputGroup 
          label="Focus"
          value={25}
          onChange={mockOnChange}
          inputId="test-input"
        />
      );
      
      const input = screen.getByDisplayValue('25');
      expect(input).toHaveAttribute('type', 'number');
      expect(input).toHaveAttribute('min', '1');
      expect(input).toHaveAttribute('max', '120');
    });
  });
});