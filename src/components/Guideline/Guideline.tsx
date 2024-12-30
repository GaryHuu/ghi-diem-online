import Joyride, { Step } from 'react-joyride';
import { useGuide } from './hooks';
import { GuideType } from './constants';

interface Props {
	steps: Step[];
	type: GuideType;
}

function Guideline({ steps, type }: Props) {
	const { guideType, handleJoyrideCallback } = useGuide();

	const isRunned = guideType === type;
	return (
		<Joyride
			disableOverlayClose
			run={isRunned}
			steps={steps}
			continuous
			showProgress
			showSkipButton
			callback={handleJoyrideCallback}
			styles={{
				options: {
					zIndex: 10000,
				},
			}}
		/>
	);
}

export default Guideline;
