import ProgressRing from './ProgressRing';
import TimeDisplay from './TimeDisplay';

export default function TimerDisplay({ timeLeft, progress }) {
	return (
		<div className="relative w-64 h-64 mx-auto mb-8">

			<ProgressRing progress={progress}/>
			<TimeDisplay timeLeft={timeLeft}/>

		</div>
	);
}
