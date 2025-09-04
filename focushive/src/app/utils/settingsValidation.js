export const DURATION_CONSTRAINTS = {
  min: 1,
  max: 120
};

export function validateDurationInput(value) {
  const numericValue = parseInt(value) || DURATION_CONSTRAINTS.min;
  return Math.max(DURATION_CONSTRAINTS.min, Math.min(DURATION_CONSTRAINTS.max, numericValue));
}

// Re-export time conversion functions from timeUtils for backward compatibility
export { convertMinutesToSeconds, convertSecondsToMinutes } from '@/app/utils/timeUtils';