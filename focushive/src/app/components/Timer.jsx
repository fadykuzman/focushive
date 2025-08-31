"use client";

import { useEffect, useState } from "react";
import useTimerStore from "../stores/timerStore";
import StartButton from "./StartButton";
import PauseButton from "./PauseButton";
import ResetRoundsButton from "./ResetRoundsButton";
import ModeSwitch from "./ModeSwitch";
import TimerDisplay from "./TimerDisplay";
import SettingsModal from "./SettingsModal";
import GitHubLink from "./GitHubLink";
import packageJson from '../../../package.json';

const Timer = () => {
	const [isHydrated, setIsHydrated] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	
	const {
		timeLeft,
		isActive,
		isPaused,
		mode,
		round,
		totalRounds,
		focusDuration,
		shortBreakDuration,
		longBreakDuration,
		startTimer,
		pauseTimer,
		resumeTimer,
		stopTimer,
		resetTimer,
		switchMode,
		tick,
		restoreTimer,
		completeTimer,
		updateDuration,
		resetRounds,
	} = useTimerStore();

	// Restore timer on component mount and mark as hydrated
	useEffect(() => {
		// restoreTimer();
		setIsHydrated(true);
	}, [restoreTimer]);

	// Handle duration changes from settings modal
	const handleDurationChange = (durationType, newDurationInSeconds) => {
		updateDuration(durationType, newDurationInSeconds);
	};

	useEffect(() => {
		// Update document title with time
		const minutes = Math.floor(timeLeft / 60);
		const seconds = timeLeft % 60;
		document.title = `${minutes}:${seconds.toString().padStart(2, "0")} - Focus Timer`;

		// Check if timer completed
		if (timeLeft === 0 && isActive) {
			completeTimer();
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
				return "Focus";
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

	// Get duration for current mode from store
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

	// Get style classes based on mode
	const getStyleClasses = (currentMode) => {
		switch (currentMode) {
			case "focus":
				return {
					background: "bg-black-500",
					container: "bg-black-600"
				};
			case "shortBreak":
				return {
					background: "bg-green-500", 
					container: "bg-green-600"
				};
			case "longBreak":
				return {
					background: "bg-blue-500",
					container: "bg-blue-600" 
				};
			default:
				return {
					background: "bg-red-500",
					container: "bg-red-600"
				};
		}
	};

	const styles = getStyleClasses(mode);

	// Show loading state until hydrated
	if (!isHydrated) {
		return (
			<div className="min-h-screen bg-gray-500 flex items-center justify-center">
				<div className="text-center">
					<div className="bg-gray-600 rounded-lg p-8 shadow-2xl max-w-md mx-auto">
						<h1 className="text-white text-2xl font-bold mb-8">Loading Timer...</h1>
						<div className="relative w-64 h-64 mx-auto mb-8">
							<div className="absolute inset-0 flex items-center justify-center">
								<span className="text-white text-6xl font-mono font-bold">--:--</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`min-h-screen ${styles.background} flex items-center justify-center transition-colors duration-500`}
		>
			<div className="text-center">
				<div
					className={`${styles.container} rounded-lg p-8 shadow-2xl max-w-md mx-auto relative`}
				>

					{/* Settings Button */}
					<button
						id="settings-button"
						onClick={() => setIsSettingsOpen(true)}
						className="absolute top-4 right-4 w-8 h-8 text-white/70 hover:text-white transition-colors"
						title="Settings"
					>
						<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
							<path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
						</svg>
					</button>

					<h1 id="timer-mode-title" className="text-white text-2xl font-bold mb-2">
						{getModeDisplayName(mode)}
					</h1>
					<div className="flex items-center justify-center gap-3 mb-8">
						<p id="timer-round-display" className="text-white/80">
							Round {round} of {totalRounds}
						</p>
						<ResetRoundsButton
							resetRounds={resetRounds}
							mode={mode}
						/>
					</div>

					{/* Timer Display */}
					<TimerDisplay 
						timeLeft={timeLeft} 
						progress={progress} 
						resetTimer={resetTimer}
						isRunning={isActive && !isPaused}
						mode={mode}
					/>

					{/* Timer Controls */}
					<div id="timer-controls" className="flex gap-2 mb-6 justify-center">
						{isActive && !isPaused ? (
							<PauseButton
								pauseTimer={pauseTimer}
								mode={mode}
							/>
						) : (
							<StartButton
								startTimer={startTimer}
								resumeTimer={resumeTimer}
								isPaused={isPaused}
								mode={mode}
							/>
						)}
					</div>

					{/* Mode Switch */}
					<div id="mode-switch-container" className="mb-4">
						<ModeSwitch
							mode={mode}
							switchMode={switchMode}
						/>
					</div>
				</div>
			</div>

			{/* Settings Modal */}
			<SettingsModal
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
				durations={{
					focus: focusDuration,
					shortBreak: shortBreakDuration,
					longBreak: longBreakDuration,
				}}
				onDurationChange={handleDurationChange}
			/>
			
			{/* Bottom right info panel */}
			<div className="absolute bottom-4 right-4 flex flex-col gap-2 items-end">
				<GitHubLink className="w-8 h-8 opacity-70 hover:opacity-100 transition-opacity" />
				<div className="text-white/50 text-sm font-mono">
					v{packageJson.version}
				</div>
			</div>
		</div>
	);
};

export default Timer;
