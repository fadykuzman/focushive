"use client";

import { useState, useEffect, useRef } from "react";
import StartButton from './StartButton';

export default function Timer() {
  const TIMER_DURATION = 25 * 60; // 25 minutes in seconds

  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Update document title with time
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.title = `${minutes}:${seconds.toString().padStart(2, "0")} - Focus Timer`;

    // Check if timer completed
    if (timeLeft === 0 && isRunning) {
      handleTimerComplete();
    }
  }, [timeLeft, isRunning]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    // Play notification sound
    playNotificationSound();

    // Reset timer
    setIsRunning(false);
    setTimeLeft(TIMER_DURATION);

    // Browser notification (optional)
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Timer Complete!", {
        body: "Your focus session has ended.",
        icon: "/icon.svg",
      });
    }
  };

  const playNotificationSound = () => {
    // Use Web Audio API for notification
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5,
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.log("Audio failed:", e);
    }
  };

  const startTimer = () => {
    setIsRunning(true);

    // Request notification permission on first start
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((TIMER_DURATION - timeLeft) / TIMER_DURATION) * 100;

  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center transition-colors duration-500">
      <div className="text-center">
        <div className="bg-red-600 rounded-lg p-8 shadow-2xl max-w-md mx-auto">
          <h1 className="text-white text-2xl font-bold mb-8">Focus Timer</h1>

          {/* Timer Display */}
          <div className="relative w-64 h-64 mx-auto mb-8">
            {/* Progress Ring */}
            <svg className="transform -rotate-90 w-64 h-64">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="white"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            {/* Time Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-6xl font-mono font-bold">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Start Button */}
          <StartButton isRunning={isRunning} startTimer={startTimer} />

          {/* Status Text */}
          <p className="text-white/80 mt-4 text-sm">
            {isRunning
              ? "Timer is running. It will reset automatically when complete."
              : "Click Start to begin your 25-minute focus session."}
          </p>
        </div>
      </div>
    </div>
  );
}
