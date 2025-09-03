export default function TimeDisplay({ timeLeft }) {
	// Format time display
	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	};
	return (
		<div className="absolute inset-0 flex items-center justify-center">
			<span className="text-white text-timer">
				{formatTime(timeLeft)}
			</span>
		</div>
	);
}
