import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ComingSoonPill from '../ComingSoonPill';

describe('ComingSoonPill Component', () => {
  describe('Rendering', () => {
    it('should render with correct text', () => {
      render(<ComingSoonPill />);
      
      expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    });

    it('should have proper styling classes', () => {
      render(<ComingSoonPill />);
      
      const pill = screen.getByText('Coming Soon');
      expect(pill).toHaveClass('inline-flex');
      expect(pill).toHaveClass('rounded-full');
      expect(pill).toHaveClass('bg-gray-200');
      expect(pill).toHaveClass('text-gray-600');
    });

    it('should be a span element', () => {
      render(<ComingSoonPill />);
      
      const pill = screen.getByText('Coming Soon');
      expect(pill.tagName).toBe('SPAN');
    });
  });

  describe('Accessibility', () => {
    it('should not be interactive', () => {
      render(<ComingSoonPill />);
      
      const pill = screen.getByText('Coming Soon');
      expect(pill).not.toHaveAttribute('tabindex');
      expect(pill).not.toHaveAttribute('role', 'button');
    });
  });
});