import React, { useEffect } from 'react';
import { useMount, useSetState } from 'react-use';

import { CallBackProps, STATUS, Step } from 'react-joyride';
import { GUIDE_STEPS } from '../constants';

interface State {
	run: GuideType | null;
	steps: Step[];
}

enum GuideType {
	HOME,
	SETTING,
}

function useGuide() {
	const [{ run, steps }, setState] = useSetState<State>({
		run: null,
		steps: GUIDE_STEPS,
	});

	// Khi mount lần đầu tiên sẽ start guideline
	useMount(() => {
		console.log('Call');
		setState({ run: GuideType.HOME });
	});

	const onStartGuide = (guideType: GuideType) => {
		setState({ run: guideType });
	};

	return { steps, run, guideType: GuideType.HOME, onStartGuide };
}

export { useGuide };
