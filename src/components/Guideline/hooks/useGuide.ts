import React, { useEffect } from 'react';
import { useMount, useSetState } from 'react-use';

import { CallBackProps, STATUS, Step } from 'react-joyride';
import { GUIDE_STEPS } from '../constants';

interface State {
	run: boolean;
	steps: Step[];
}

function useGuide() {
	const [{ run, steps }, setState] = useSetState<State>({
		run: false,
		steps: GUIDE_STEPS,
	});

	useMount(() => {
		console.log('Call');
		setState({ run: true });
	});

	return { steps, run };
}

export { useGuide };
