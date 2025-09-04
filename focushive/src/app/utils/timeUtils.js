/**
 * Shared time utilities for the FocusHive application
 * Consolidates time formatting and conversion functions
 */

/**
 * Convert minutes to seconds
 * @param {number} minutes - Number of minutes
 * @returns {number} Seconds
 */
export function convertMinutesToSeconds(minutes) {
  return minutes * 60;
}

/**
 * Convert seconds to minutes (rounded down)
 * @param {number} seconds - Number of seconds
 * @returns {number} Minutes
 */
export function convertSecondsToMinutes(seconds) {
  return Math.floor(seconds / 60);
}

/**
 * Format duration in human-readable format (e.g., "1h 30m", "45m")
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string
 */
export function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Format time in timer format (e.g., "25:00", "1:05")
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Format time with explicit hours, minutes, seconds (e.g., "1:25:30", "25:30")
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string with optional hours
 */
export function formatTimeWithHours(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}