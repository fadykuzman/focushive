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
import Timer from "@/app/components/Timer";
import { useModalManager } from "@/app/hooks/useModalManager";
import { ModeSwitchConfirmationProvider, useModeSwitchConfirmationContext } from "@/app/components/mode-switch/ModeSwitchConfirmationProvider";
import packageJson from '../../../package.json';

const Home = () => {
	const [isHydrated, setIsHydrated] = useState(false);
	
	const {
		timeLeft,
		isActive,
		isPaused,
		mode,
		linkedTaskId,
		setLinkedTask
	} = useTimerStore();

	const { modals, handlers } = useModalManager();

	// Hydration effect
	useEffect(() => {
		setIsHydrated(true);
	}, []);

	// Handle task selection from TaskListModal
	const handleTaskSelect = (task) => {
		if (task) {
			setLinkedTask(task.id);
		} else {
			setLinkedTask(null);
		}
	};

	return (
		<ModeSwitchConfirmationProvider>
			<HomeContent 
				isHydrated={isHydrated}
				timeLeft={timeLeft}
				isActive={isActive}
				isPaused={isPaused}
				mode={mode}
				linkedTaskId={linkedTaskId}
				modals={modals}
				handlers={handlers}
				onTaskSelect={handleTaskSelect}
			/>
		</ModeSwitchConfirmationProvider>
	);
};

const HomeContent = ({ isHydrated, timeLeft, isActive, isPaused, mode, linkedTaskId, modals, handlers, onTaskSelect }) => {
	const { requestModeSwitch } = useModeSwitchConfirmationContext();

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
				onRequestModeSwitch={requestModeSwitch}
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
				onTaskSelect={onTaskSelect}
				selectedTaskId={linkedTaskId}
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