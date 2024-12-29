import React, { ReactNode } from 'react';
import Joyride from 'react-joyride';
import { useGuide } from './hooks';

function Guideline() {
	const { run, steps, guideType } = useGuide();
	return <Joyride run={run === guideType} steps={steps} continuous showProgress showSkipButton />;
}

export default Guideline;
