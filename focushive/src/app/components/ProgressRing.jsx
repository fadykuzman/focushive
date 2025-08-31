export default function ProgressRing({ progress }) {
	return (
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
			/>
		</svg>
	);
}
