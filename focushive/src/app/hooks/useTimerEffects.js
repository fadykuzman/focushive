import { useEffect, useState } from 'react';

export function useTimerEffects({ 
  timeLeft, 
  isActive, 
  isPaused, 
  mode, 
  focusDuration, 
  shortBreakDuration, 
  longBreakDuration, 
  tick, 
  completeTimer 
}) {
  const [smoothProgress, setSmoothProgress] = useState(0);

  // Get duration for current mode
  function getModeDuration(currentMode) {
    switch (currentMode) {
      case "focus":
        return focusDuration;
      case "shortBreak":
        return shortBreakDuration;
      case "longBreak":
        return longBreakDuration;
      default:
        return focusDuration;
    }
  }

  // Update document title with time
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.title = `${minutes}:${seconds.toString().padStart(2, "0")} - Focus Timer`;

    // Check if timer completed
    if (timeLeft === 0 && isActive) {
      completeTimer();
    }
  }, [timeLeft, isActive, completeTimer]);

  // Handle timer tick
  useEffect(() => {
    let interval = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, tick]);

  // Handle smooth progress interpolation
  useEffect(() => {
    let animationFrame = null;
    const startTime = Date.now();
    const targetProgress = ((getModeDuration(mode) - timeLeft) / getModeDuration(mode)) * 100;

    const updateSmoothProgress = () => {
      if (isActive && !isPaused && timeLeft > 0) {
        const elapsed = (Date.now() - startTime) / 1000;
        const interpolatedProgress = targetProgress + (elapsed / getModeDuration(mode)) * 100;
        setSmoothProgress(Math.min(interpolatedProgress, 100));
        animationFrame = requestAnimationFrame(updateSmoothProgress);
      } else {
        setSmoothProgress(targetProgress);
      }
    };

    updateSmoothProgress();
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [timeLeft, isActive, isPaused, mode, focusDuration, shortBreakDuration, longBreakDuration]);

  return {
    smoothProgress,
    getModeDuration
  };
}