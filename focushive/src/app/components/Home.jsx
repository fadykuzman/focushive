"use client";

import { useEffect, useState } from "react";
import useTimerStore from "@/app/stores/timerStore";
import SettingsModal from "@/app/components/settings/SettingsModal";
import StatsDashboard from "@/app/components/reports/StatsDashboard";
import GitHubLink from "@/app/components/GitHubLink";
import PrivacyLink from "@/app/components/PrivacyLink";
import TermsLink from "@/app/components/TermsLink";
import DonationLink from "@/app/components/DonationLink";
import TaskListModal from "@/app/components/task-management/TaskListModal";
import NotesModal from "@/app/components/notes/NotesModal";
import ModeSwitchConfirmModal from "@/app/components/ModeSwitchConfirmModal";
import Timer from "@/app/components/Timer";
import { useModalManager } from "@/app/hooks/useModalManager";
import { getDurationForMode } from "@/app/utils/timer";
import packageJson from '../../../package.json';

const Home = () => {
	const [isHydrated, setIsHydrated] = useState(false);
	const [modeSwitchConfirm, setModeSwitchConfirm] = useState({ 
		isOpen: false, 
		targetMode: null,
		wasAutoPaused: false
	});
	
	const {
		timeLeft,
		isActive,
		isPaused,
		mode,
		focusDuration,
		shortBreakDuration,
		longBreakDuration,
		linkedTaskId,
		switchMode,
		pauseTimer,
		resumeTimer
	} = useTimerStore();

	const { modals, handlers } = useModalManager();

	// Hydration effect
	useEffect(() => {
		setIsHydrated(true);
	}, []);



	// Handle mode switch request from Timer component
	const handleModeSwitchRequest = (targetMode) => {
		// Check if timer is currently running (not paused) and auto-pause it
		const shouldAutoPause = isActive && !isPaused;
		
		if (shouldAutoPause) {
			pauseTimer();
		}
		
		setModeSwitchConfirm({
			isOpen: true,
			targetMode: targetMode,
			wasAutoPaused: shouldAutoPause
		});
	};

	// Handle mode switch confirmation
	const handleModeSwitchConfirm = () => {
		if (modeSwitchConfirm.targetMode) {
			switchMode(modeSwitchConfirm.targetMode);
		}
		// Don't resume timer - user is switching modes anyway
		setModeSwitchConfirm({ isOpen: false, targetMode: null, wasAutoPaused: false });
	};

	// Handle mode switch cancellation
	const handleModeSwitchCancel = () => {
		// Resume timer only if we auto-paused it
		if (modeSwitchConfirm.wasAutoPaused) {
			resumeTimer();
		}
		
		setModeSwitchConfirm({ isOpen: false, targetMode: null, wasAutoPaused: false });
	};

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
			{/* Timer Component */}
			<Timer
				onRequestModeSwitch={handleModeSwitchRequest}
				onOpenTasks={handlers.openTaskList}
				onOpenStats={handlers.openStats}
				onOpenSettings={handlers.openSettings}
				onOpenNotes={handlers.openNotes}
			/>

			{/* Global Modals */}
			
			{/* Settings Modal */}
			<SettingsModal
				isOpen={modals.isSettingsOpen}
				onClose={handlers.closeSettings}
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
			/>

			{/* Mode Switch Confirmation Modal */}
			<ModeSwitchConfirmModal
				isOpen={modeSwitchConfirm.isOpen}
				onConfirm={handleModeSwitchConfirm}
				onCancel={handleModeSwitchCancel}
				targetMode={modeSwitchConfirm.targetMode}
				currentMode={mode}
				timeLeft={timeLeft}
				isActive={isActive}
				isPaused={isPaused}
			/>
			
			{/* Global UI Elements */}
			
			{/* Bottom right info panel - Hide in active focus mode */}
			{!(mode === 'focus' && isActive && !isPaused) && (
				<div className="fixed bottom-4 right-4 flex flex-col gap-2 items-end z-10">
					<DonationLink className="w-8 h-8 opacity-70 hover:opacity-100 transition-opacity" />
					<div className="w-full h-px bg-white/20 my-1"></div>
					<GitHubLink className="w-8 h-8 opacity-70 hover:opacity-100 transition-opacity" />
					<PrivacyLink className="w-8 h-8 opacity-70 hover:opacity-100 transition-opacity" />
					<TermsLink className="w-8 h-8 opacity-70 hover:opacity-100 transition-opacity" />
					<div className="text-white/50 text-sm font-mono">
						v{packageJson.version}
					</div>
				</div>
			)}
		</>
	);
};

export default Home;