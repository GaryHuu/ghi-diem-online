import { useMount, useSetState } from 'react-use';

import { Step, CallBackProps, STATUS } from 'react-joyride';
import { GuideType, HOME_GUIDE_STEPS, SETTING_GUIDE_STEPS } from '../constants';

interface State {
	run: boolean;
	guideType: GuideType;
}

function useGuide() {
	const [{ run, guideType }, setState] = useSetState<State>({
		run: false,
		guideType: GuideType.HOME,
	});

	const onStartGuide = () => {
		setState({ run: true });
	};

	const handleJoyrideCallback = (data: CallBackProps) => {
		const { status } = data;
		const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

		if (finishedStatuses.includes(status)) {
			console.log({ status });
			setState({ run: false });
		}
	};
	console.log({ run });
	return { run, guideType, onStartGuide, handleJoyrideCallback };
}

export { useGuide };
