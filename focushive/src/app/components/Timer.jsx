"use client";

import { useEffect } from "react";
import useTimerStore from "@/app/stores/timerStore";
import TimerLayout from "@/app/components/timer/TimerLayout";
import { useTodayStats } from "@/app/hooks/useSessionStats";
import { useTimerEffects } from "@/app/hooks/useTimerEffects";
import { useTaskIntegration } from "@/app/hooks/useTaskIntegration";
import { getDurationForMode } from "@/app/utils/timer";

const Timer = ({ 
	onRequestModeSwitch,
	onOpenTasks,
	onOpenStats,
	onOpenSettings,
	onOpenNotes
}) => {
	
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
		linkedTaskId,
		pauseTimer,
		resumeTimer,
		resetTimer,
		switchMode,
		updateDuration,
		setLinkedTask,
		clearLinkedTask,
		startTimer,
		tick,
		restoreTimer,
		completeTimer,
		resetRounds,
	} = useTimerStore();

	const { focusTime, sessions, completionRate } = useTodayStats();
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

	// Restore timer on component mount
	useEffect(() => {
		// restoreTimer();
	}, [restoreTimer]);

	// Handle duration changes
	const handleDurationChange = (durationType, newDurationInSeconds) => {
		updateDuration(durationType, newDurationInSeconds);
	};

	// Check if mode switch needs confirmation
	const needsConfirmation = (targetMode) => {
		if (targetMode === mode) return false;
		
		const originalDuration = getDurationForMode(mode, {
			focusDuration,
			shortBreakDuration,
			longBreakDuration
		});
		
		const hasProgress = timeLeft < originalDuration;
		const isRunning = isActive && !isPaused;
		const isPausedWithProgress = isPaused && hasProgress;
		
		return isRunning || isPausedWithProgress;
	};

	// Handle mode switch request internally
	const handleModeSwitch = (targetMode) => {
		if (needsConfirmation(targetMode)) {
			onRequestModeSwitch(targetMode);
		} else {
			switchMode(targetMode);
		}
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

	return (
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
			switchMode={handleModeSwitch}
			onTaskSelect={handleTaskSelect}
			linkedTaskId={linkedTaskId}
			durationsConfig={{
				focus: focusDuration,
				shortBreak: shortBreakDuration,
				longBreak: longBreakDuration,
			}}
			onDurationChange={handleDurationChange}
			onOpenTasks={onOpenTasks}
			onOpenStats={onOpenStats}
			onOpenSettings={onOpenSettings}
			onOpenNotes={onOpenNotes}
		/>
	);
};

export default Timer;