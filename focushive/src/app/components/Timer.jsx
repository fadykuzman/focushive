"use client";

import { useEffect, useState } from "react";
import useTimerStore from "../stores/timerStore";
import SettingsModal from "./settings/SettingsModal";
import StatsDashboard from "./reports/StatsDashboard";
import GitHubLink from "./GitHubLink";
import TaskListModal from "./task-management/TaskListModal";
import NotesModal from "./notes/NotesModal";
import TimerLayout from "./timer/TimerLayout";
import { useTodayStats } from "../hooks/useSessionStats";
import { useModalManager } from "../hooks/useModalManager";
import { useTimerEffects } from "../hooks/useTimerEffects";
import { useTaskIntegration } from "../hooks/useTaskIntegration";
import packageJson from '../../../package.json';

const Timer = () => {
	const [isHydrated, setIsHydrated] = useState(false);
	
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
	const { modals, handlers } = useModalManager();
	const { smoothProgress } = useTimerEffects({
		timeLeft,
		isActive,
		isPaused,
		mode,
		focusDuration,
		shortBreakDuration,
		longBreakDuration,
		tick,
		completeTimer
	});
	const { currentTask, handleTaskSelect, handleStartTimer } = useTaskIntegration(
		linkedTaskId,
		setLinkedTask,
		clearLinkedTask,
		startTimer
	);

	// Restore timer on component mount and mark as hydrated
	useEffect(() => {
		// restoreTimer();
		setIsHydrated(true);
	}, [restoreTimer]);

	// Handle duration changes from settings modal
	const handleDurationChange = (durationType, newDurationInSeconds) => {
		updateDuration(durationType, newDurationInSeconds);
	};

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
		<>
			<TimerLayout
				mode={mode}
				styles={styles}
				timeLeft={timeLeft}
				smoothProgress={smoothProgress}
				resetTimer={resetTimer}
				isActive={isActive}
				isPaused={isPaused}
				round={round}
				totalRounds={totalRounds}
				resetRounds={resetRounds}
				focusTime={focusTime}
				sessions={sessions}
				completionRate={completionRate}
				currentTask={currentTask}
				onStartTimer={handleStartTimer}
				pauseTimer={pauseTimer}
				resumeTimer={resumeTimer}
				switchMode={switchMode}
				onTaskSelect={handleTaskSelect}
				linkedTaskId={linkedTaskId}
				onOpenTasks={handlers.openTaskList}
				onOpenStats={handlers.openStats}
				onOpenSettings={handlers.openSettings}
			/>

			{/* Settings Modal */}
			<SettingsModal
				isOpen={modals.isSettingsOpen}
				onClose={handlers.closeSettings}
				durations={{
					focus: focusDuration,
					shortBreak: shortBreakDuration,
					longBreak: longBreakDuration,
				}}
				onDurationChange={handleDurationChange}
			/>

			{/* Statistics Dashboard */}
			<StatsDashboard
				isOpen={modals.isStatsOpen}
				onClose={handlers.closeStats}
			/>

			{/* Notes Modal */}
			<NotesModal
				isOpen={modals.isNotesOpen}
				onClose={handlers.closeNotes}
				taskId={linkedTaskId}
			/>
			
			{/* Task List Modal */}
			<TaskListModal 
				isOpen={modals.isTaskListOpen}
				onClose={handlers.closeTaskList}
				onTaskSelect={handleTaskSelect}
				selectedTaskId={linkedTaskId}
			/>
			
			{/* Bottom right info panel */}
			<div className="fixed bottom-4 right-4 flex flex-col gap-2 items-end z-10">
				<GitHubLink className="w-8 h-8 opacity-70 hover:opacity-100 transition-opacity" />
				<div className="text-white/50 text-sm font-mono">
					v{packageJson.version}
				</div>
			</div>
		</>
	);
};

export default Timer;