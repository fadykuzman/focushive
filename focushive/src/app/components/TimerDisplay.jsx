import ProgressRing from '@/app/components/ProgressRing';
import TimeDisplay from '@/app/components/TimeDisplay';
import ResetTimerButton from '@/app/components/ResetTimerButton';

export default function TimerDisplay({ timeLeft, progress, resetTimer, isRunning, mode }) {
	return (
		<div className="relative w-64 h-64 mx-auto mb-8">

			<ProgressRing progress={progress}/>
			<TimeDisplay timeLeft={timeLeft}/>
			
			{/* Reset Timer Button positioned between time and progress bar bottom */}
			<div className="absolute inset-0 flex items-center justify-center" style={{ top: '60%' }}>
				<ResetTimerButton resetTimer={resetTimer} isRunning={isRunning} mode={mode} />
			</div>

		</div>
	);
}
