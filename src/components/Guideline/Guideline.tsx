import React, { ReactNode } from 'react';
import Joyride from 'react-joyride';
import { useGuide } from './hooks';

function Guideline() {
	const { run, steps } = useGuide();
	return <Joyride run={run} steps={steps} />;
}

export default Guideline;
