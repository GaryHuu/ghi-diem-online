import Joyride, { Step } from 'react-joyride';
import { useGuide } from './hooks';

interface Props {
	steps: Step[];
}

function Guideline({ steps }: Props) {
	const { run, handleJoyrideCallback } = useGuide();
	console.log({ run });
	return (
		<Joyride
			run={run}
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
