import { describe, it, expect, vi } from 'vitest';
import { calculateElapsedTime, createTimeProvider } from '../timeCalculation.js';

describe('Time Calculation', () => {
  describe('calculateElapsedTime', () => {
    it('should return 0 when lastTick is null', () => {
      const result = calculateElapsedTime(null);
      expect(result).toBe(0);
    });

    it('should return 0 when lastTick is undefined', () => {
      const result = calculateElapsedTime(undefined);
      expect(result).toBe(0);
    });

    it('should calculate elapsed time correctly', () => {
      const mockCurrentTime = 1000000;
      const lastTick = 995000;
      const mockTimeProvider = () => mockCurrentTime;
      
      const result = calculateElapsedTime(lastTick, mockTimeProvider);
      expect(result).toBe(5);
    });

    it('should floor decimal values', () => {
      const mockCurrentTime = 1000500;
      const lastTick = 999000;
      const mockTimeProvider = () => mockCurrentTime;
      
      const result = calculateElapsedTime(lastTick, mockTimeProvider);
      expect(result).toBe(1);
    });

    it('should use Date.now by default', () => {
      const mockDateNow = vi.spyOn(Date, 'now').mockReturnValue(2000000);
      const lastTick = 1995000;
      
      const result = calculateElapsedTime(lastTick);
      expect(result).toBe(5);
      
      mockDateNow.mockRestore();
    });

    it('should handle same timestamp', () => {
      const timestamp = 1000000;
      const mockTimeProvider = () => timestamp;
      
      const result = calculateElapsedTime(timestamp, mockTimeProvider);
      expect(result).toBe(0);
    });

    it('should handle large time differences', () => {
      const mockCurrentTime = 2000000000;
      const lastTick = 1000000000;
      const mockTimeProvider = () => mockCurrentTime;
      
      const result = calculateElapsedTime(lastTick, mockTimeProvider);
      expect(result).toBe(1000000);
    });
  });

  describe('createTimeProvider', () => {
    it('should return a function', () => {
      const timeProvider = createTimeProvider();
      expect(typeof timeProvider).toBe('function');
    });

    it('should return Date.now function', () => {
      const timeProvider = createTimeProvider();
      expect(timeProvider).toBe(Date.now);
    });

    it('should return current timestamp when called', () => {
      const timeProvider = createTimeProvider();
      const before = Date.now();
      const result = timeProvider();
      const after = Date.now();
      
      expect(result).toBeGreaterThanOrEqual(before);
      expect(result).toBeLessThanOrEqual(after);
    });
  });
});