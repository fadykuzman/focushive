import { 
  convertMinutesToSeconds, 
  convertSecondsToMinutes, 
  formatDuration, 
  formatTime, 
  formatTimeWithHours 
} from '../timeUtils';

describe('timeUtils', () => {
  describe('convertMinutesToSeconds', () => {
    test('should convert minutes to seconds correctly', () => {
      expect(convertMinutesToSeconds(25)).toBe(1500);
      expect(convertMinutesToSeconds(5)).toBe(300);
      expect(convertMinutesToSeconds(0)).toBe(0);
      expect(convertMinutesToSeconds(1)).toBe(60);
    });
  });

  describe('convertSecondsToMinutes', () => {
    test('should convert seconds to minutes correctly (rounded down)', () => {
      expect(convertSecondsToMinutes(1500)).toBe(25);
      expect(convertSecondsToMinutes(300)).toBe(5);
      expect(convertSecondsToMinutes(59)).toBe(0);
      expect(convertSecondsToMinutes(60)).toBe(1);
      expect(convertSecondsToMinutes(125)).toBe(2);
    });
  });

  describe('formatDuration', () => {
    test('should format duration in human-readable format', () => {
      expect(formatDuration(3600)).toBe('1h 0m');
      expect(formatDuration(3900)).toBe('1h 5m');
      expect(formatDuration(1800)).toBe('30m');
      expect(formatDuration(300)).toBe('5m');
      expect(formatDuration(0)).toBe('0m');
      expect(formatDuration(7260)).toBe('2h 1m');
    });
  });

  describe('formatTime', () => {
    test('should format time in timer format', () => {
      expect(formatTime(3600)).toBe('60:00');
      expect(formatTime(1500)).toBe('25:00');
      expect(formatTime(65)).toBe('1:05');
      expect(formatTime(5)).toBe('0:05');
      expect(formatTime(0)).toBe('0:00');
      expect(formatTime(3661)).toBe('61:01');
    });
  });

  describe('formatTimeWithHours', () => {
    test('should format time with hours when needed', () => {
      expect(formatTimeWithHours(3600)).toBe('1:00:00');
      expect(formatTimeWithHours(3661)).toBe('1:01:01');
      expect(formatTimeWithHours(1500)).toBe('25:00');
      expect(formatTimeWithHours(65)).toBe('1:05');
      expect(formatTimeWithHours(5)).toBe('0:05');
      expect(formatTimeWithHours(0)).toBe('0:00');
      expect(formatTimeWithHours(7325)).toBe('2:02:05');
    });
  });
});