"use client";

import packageJson from '../../../package.json';

const VersionDisplay = () => {
	return (
		<div className="absolute bottom-4 left-4 text-white/50 text-sm font-mono">
			v{packageJson.version}
		</div>
	);
};

export default VersionDisplay;