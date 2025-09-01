export default function ProgressRing({ progress }) {
	const circumference = 2 * Math.PI * 120;
	const strokeDashoffset = circumference * (1 - progress / 100);

	return (
		<svg className="transform -rotate-90 w-64 h-64" viewBox="0 0 256 256">
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
				strokeDasharray={circumference}
				strokeDashoffset={strokeDashoffset}
				className="transition-all duration-300 ease-out"
			/>
		</svg>
	);
}
