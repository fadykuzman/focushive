"use client";

import { useEffect, useState } from "react";
import useTimerStore from "../stores/timerStore";
import StartButton from "./StartButton";
import PauseButton from "./PauseButton";
import ResetRoundsButton from "./ResetRoundsButton";
import ModeSwitch from "./ModeSwitch";
import TimerDisplay from "./TimerDisplay";
import SettingsModal from "./settings/SettingsModal";
import StatsDashboard from "./reports/StatsDashboard";
import GitHubLink from "./GitHubLink";
import TaskSelector from "./task-management/TaskSelector";
import TaskManager from "./task-management/TaskManager";
import FocusTaskList from "./task-management/FocusTaskList";
import NotesModal from "./notes/NotesModal";
import { useTodayStats } from "../hooks/useSessionStats";
import { useTaskManager } from "../hooks/useTaskManager";
import packageJson from '../../../package.json';

const Timer = () => {
	const [isHydrated, setIsHydrated] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isStatsOpen, setIsStatsOpen] = useState(false);
	const [isTasksOpen, setIsTasksOpen] = useState(false);
	const [isNotesOpen, setIsNotesOpen] = useState(false);
	const [smoothProgress, setSmoothProgress] = useState(0);
	
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
		autoTimerStart,
		linkedTaskId,
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
		setLinkedTask,
		clearLinkedTask,
	} = useTimerStore();

	const { focusTime, sessions, completionRate } = useTodayStats();
	const { tasks } = useTaskManager();

	// Get current linked task
	const currentTask = linkedTaskId ? tasks.find(task => task.id === linkedTaskId) : null;

	// Restore timer on component mount and mark as hydrated
	useEffect(() => {
		// restoreTimer();
		setIsHydrated(true);
	}, [restoreTimer]);

	// Handle duration changes from settings modal
	const handleDurationChange = (durationType, newDurationInSeconds) => {
		updateDuration(durationType, newDurationInSeconds);
	};

	// Handle task selection
	const handleTaskSelect = (task) => {
		if (task) {
			setLinkedTask(task.id);
			// Auto-set task to in_progress when selected for focus
			if (task.status === 'pending') {
				// Note: This could be handled by the task list component
			}
		} else {
			clearLinkedTask();
		}
	};

	// Handle start timer with task
	const handleStartTimer = () => {
		startTimer(linkedTaskId);
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
					className={`${styles.container} rounded-lg p-8 shadow-2xl max-w-lg mx-auto relative`}
				>

					{/* Top Controls */}
					<div className="absolute top-4 right-4 flex gap-2">
						{/* Notes Button */}
						<button
							id="notes-button"
							onClick={() => setIsNotesOpen(true)}
							className="w-8 h-8 text-white/70 hover:text-white transition-colors"
							title="Notes"
						>
							<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
								<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
							</svg>
						</button>

						{/* Tasks Button */}
						<button
							id="tasks-button"
							onClick={() => setIsTasksOpen(true)}
							className="w-8 h-8 text-white/70 hover:text-white transition-colors"
							title="Tasks"
						>
							<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
								<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
							</svg>
						</button>

						{/* Statistics Button */}
						<button
							id="stats-button"
							onClick={() => setIsStatsOpen(true)}
							className="w-8 h-8 text-white/70 hover:text-white transition-colors"
							title="Statistics"
						>
							<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
								<path d="M5 12h2v7H5v-7zm6-4h2v11h-2V8zm6-6h2v17h-2V2z"/>
							</svg>
						</button>
						
						{/* Settings Button */}
						<button
							id="settings-button"
							onClick={() => setIsSettingsOpen(true)}
							className="w-8 h-8 text-white/70 hover:text-white transition-colors"
							title="Settings"
						>
							<svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
								<path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
							</svg>
						</button>
					</div>

					<h1 id="timer-mode-title" className="text-white text-2xl font-bold mb-2 mt-12 sm:mt-8">
						{getModeDisplayName(mode)}
					</h1>
					<div className="flex items-center justify-center gap-3 mb-4">
						<p id="timer-round-display" className="text-white/80">
							Round {round} of {totalRounds}
						</p>
						<ResetRoundsButton
							resetRounds={resetRounds}
							mode={mode}
						/>
					</div>

					{/* Today's Stats Preview */}
					{focusTime > 0 && (
						<div id="timer-stats-preview" className="text-center mb-4">
							<div id="timer-stats-preview-text" className="text-white/60 text-sm">
								Today: {Math.floor(focusTime / 60)}m focus • {sessions} sessions • {completionRate}% rate
							</div>
						</div>
					)}

					{/* Timer Display */}
					<TimerDisplay 
						timeLeft={timeLeft} 
						progress={smoothProgress} 
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
								startTimer={handleStartTimer}
								resumeTimer={resumeTimer}
								isPaused={isPaused}
								mode={mode}
							/>
						)}
					</div>

					{/* Mode Switch */}
					<div id="mode-switch-container" className="mb-6">
						<ModeSwitch
							mode={mode}
							switchMode={switchMode}
						/>
					</div>

					{/* Active Task Display - Show when focus session is active and task is assigned */}
					{mode === 'focus' && isActive && currentTask && (
						<div className="mb-6 px-4">
							<div id="active-task-display" className="flex items-center justify-center gap-3 p-3 rounded-lg bg-white/5 border border-white/20">
								<span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-medium">
									Active
								</span>
								<span className="text-white font-medium">{currentTask.title}</span>
							</div>
						</div>
					)}

					{/* Focus Task List - Only show for focus mode when not active */}
					{mode === 'focus' && !isActive && (
						<div className="mb-4 px-4">
							<FocusTaskList 
								onTaskSelect={handleTaskSelect}
								selectedTaskId={linkedTaskId}
							/>
						</div>
					)}
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

			{/* Statistics Dashboard */}
			<StatsDashboard
				isOpen={isStatsOpen}
				onClose={() => setIsStatsOpen(false)}
			/>

			{/* Task Management Modal */}
			{isTasksOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto w-full">
						<div className="p-6">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-2xl font-bold">Task Management</h2>
								<button
									onClick={() => setIsTasksOpen(false)}
									className="text-gray-500 hover:text-gray-700"
								>
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
							<TaskManager />
						</div>
					</div>
				</div>
			)}

			{/* Notes Modal */}
			<NotesModal
				isOpen={isNotesOpen}
				onClose={() => setIsNotesOpen(false)}
				taskId={linkedTaskId}
			/>
			
			{/* Bottom right info panel */}
			<div className="fixed bottom-4 right-4 flex flex-col gap-2 items-end z-10">
				<GitHubLink className="w-8 h-8 opacity-70 hover:opacity-100 transition-opacity" />
				<div className="text-white/50 text-sm font-mono">
					v{packageJson.version}
				</div>
			</div>
		</div>
	);
};

export default Timer;
