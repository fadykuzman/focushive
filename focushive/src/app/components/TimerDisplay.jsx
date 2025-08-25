export default function TimerDisplay({ timeLeft, progress }) {
	// Format time display
	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	};
	return (
		<div className="relative w-64 h-64 mx-auto mb-8">
			{/* Progress Ring */}
			<svg className="transform -rotate-90 w-64 h-64">
				<circle
					cx="128"
					cy="128"
					r="120"
					stroke="rgba(255,255,255,0.2)"
					strokeWidth="12"
					fill="none"
				/>
				<circle
					cx="128"
					cy="128"
					r="120"
					stroke="white"
					strokeWidth="12"
					fill="none"
					strokeDasharray={`${2 * Math.PI * 120}`}
					strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
					className="transition-all duration-1000 ease-linear"
				/>
			</svg>

			{/* Time Display */}
			<div className="absolute inset-0 flex items-center justify-center">
				<span className="text-white text-6xl font-mono font-bold">
					{formatTime(timeLeft)}
				</span>
			</div>
		</div>
	);
}
