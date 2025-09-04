"use client";

import TimerLayout from "@/app/components/timer/TimerLayout";
import { useTimerLogic } from "@/app/hooks/useTimerLogic";

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
		smoothProgress,
		focusTime,
		sessions,
		completionRate,
		currentTask,
		linkedTaskId,
		durationsConfig,
		pauseTimer,
		resumeTimer,
		resetTimer,
		resetRounds,
		handleStartTimer,
		handleTaskSelect,
		handleModeSwitch,
		handleDurationChange,
		styles
	} = useTimerLogic(onRequestModeSwitch);

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
			durationsConfig={durationsConfig}
			onDurationChange={handleDurationChange}
			onOpenTasks={onOpenTasks}
			onOpenStats={onOpenStats}
			onOpenSettings={onOpenSettings}
			onOpenNotes={onOpenNotes}
		/>
	);
};

export default Timer;