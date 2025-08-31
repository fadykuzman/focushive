export const DURATION_CONSTRAINTS = {
  min: 1,
  max: 120
};

export function validateDurationInput(value) {
  const numericValue = parseInt(value) || DURATION_CONSTRAINTS.min;
  return Math.max(DURATION_CONSTRAINTS.min, Math.min(DURATION_CONSTRAINTS.max, numericValue));
}

export function convertMinutesToSeconds(minutes) {
  return minutes * 60;
}

export function convertSecondsToMinutes(seconds) {
  return Math.floor(seconds / 60);
}