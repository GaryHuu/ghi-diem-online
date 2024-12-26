import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateGuide } from '@/redux/slices/guideSlice';
import { RootState } from '@/redux/store';
import { ACTIONS, CallBackProps, STATUS } from 'react-joyride';
import { GuideType } from '../constants';

function useGuide() {
	const guide = useAppSelector((state: RootState) => state.guide);
	const { guideType, settingGuide } = guide;
	const dispatch = useAppDispatch();
	const onStartGuide = (_guideType: GuideType) => {
		dispatch(updateGuide({ guideType: _guideType }));
	};

	const handleJoyrideCallback = (data: CallBackProps) => {
		const { action, status } = data;

		const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

		if (finishedStatuses.includes(status) || action === ACTIONS.CLOSE) {
			dispatch(updateGuide({ guideType: null }));
		}
	};

	return { guideType, settingGuide, onStartGuide, handleJoyrideCallback };
}

export { useGuide };
