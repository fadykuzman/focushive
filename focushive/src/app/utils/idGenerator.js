/**
 * Shared ID generation utilities for the FocusHive application
 * Consolidates ID generation patterns across all database classes
 */

/**
 * Generate a base ID with timestamp and random component
 * @param {string} prefix - The prefix for the ID (e.g., 'session', 'note', 'task')
 * @returns {string} Generated unique ID
 */
function generateBaseId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a unique session ID
 * @returns {string} Session ID with format: session_timestamp_randomstring
 */
export function generateSessionId() {
  return generateBaseId('session');
}

/**
 * Generate a unique note ID
 * @returns {string} Note ID with format: note_timestamp_randomstring
 */
export function generateNoteId() {
  return generateBaseId('note');
}

/**
 * Generate a unique task ID
 * @returns {string} Task ID with format: task_timestamp_randomstring
 */
export function generateTaskId() {
  return generateBaseId('task');
}

/**
 * Generate a unique task session ID
 * @returns {string} Task session ID with format: tasksession_timestamp_randomstring
 */
export function generateTaskSessionId() {
  return generateBaseId('tasksession');
}

/**
 * Generic ID generator for custom prefixes
 * @param {string} prefix - Custom prefix for the ID
 * @returns {string} Generated ID with the custom prefix
 */
export function generateId(prefix) {
  return generateBaseId(prefix);
}