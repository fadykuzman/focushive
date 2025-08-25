"use client";

import { useEffect } from "react";
import useTimerStore from "../stores/timerStore";
import StartButton from "./StartButton";
import TimerDisplay from "./TimerDisplay";

const Timer = () => {
	const {
		timeLeft,
		isActive,
		isPaused,
		mode,
		round,
		totalRounds,
		startTimer,
		pauseTimer,
		resumeTimer,
		stopTimer,
		resetTimer,
		switchMode,
		tick,
	} = useTimerStore();

	useEffect(() => {
		// Update document title with time
		const minutes = Math.floor(timeLeft / 60);
		const seconds = timeLeft % 60;
		document.title = `${minutes}:${seconds.toString().padStart(2, "0")} - Focus Timer`;

		// Check if timer completed
		if (timeLeft === 0 && isActive) {
			handleTimerComplete();
		}
	}, [timeLeft, isActive]);

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


	// Get mode display name
	const getModeDisplayName = (mode) => {
		switch (mode) {
			case "focus":
				return "Focus Time";
			case "shortBreak":
				return "Short Break";
			case "longBreak":
				return "Long Break";
			default:
				return "Focus Time";
		}
	};

	const progress =
		((getModeDuration(mode) - timeLeft) / getModeDuration(mode)) * 100;

	// Get duration for current mode
	function getModeDuration(currentMode) {
		switch (currentMode) {
			case "focus":
				return 25 * 60; // 25 minutes
			case "shortBreak":
				return 5 * 60; // 5 minutes
			case "longBreak":
				return 15 * 60; // 15 minutes
			default:
				return 25 * 60;
		}
	}

	// Get color scheme based on mode
	const getColorScheme = (currentMode) => {
		switch (currentMode) {
			case "focus":
				return "red";
			case "shortBreak":
				return "green";
			case "longBreak":
				return "blue";
			default:
				return "red";
		}
	};

	const colorScheme = getColorScheme(mode);

	return (
		<div
			className={`min-h-screen bg-${colorScheme}-500 flex items-center justify-center transition-colors duration-500`}
		>
			<div className="text-center">
				<div
					className={`bg-${colorScheme}-600 rounded-lg p-8 shadow-2xl max-w-md mx-auto`}
				>
					<h1 className="text-white text-2xl font-bold mb-2">
						{getModeDisplayName(mode)}
					</h1>
					<p className="text-white/80 mb-8">
						Round {round} of {totalRounds}
					</p>

					{/* Timer Display */}
					<TimerDisplay timeLeft={timeLeft} progress={progress} />

					{/* Timer Controls */}
					<div className="flex gap-2 mb-6 justify-center">
						<StartButton
							isRunning={isActive && !isPaused}
							startTimer={startTimer}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Timer;
