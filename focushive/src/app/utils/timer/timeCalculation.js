export function calculateElapsedTime(lastTick, getCurrentTime = Date.now) {
  if (!lastTick) return 0;
  return Math.floor((getCurrentTime() - lastTick) / 1000);
}

export function createTimeProvider() {
  return Date.now;
}