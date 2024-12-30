import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateGuide } from '@/redux/slices/guideSlice';
import { RootState } from '@/redux/store';
import { CallBackProps, STATUS } from 'react-joyride';
import { GuideType } from '../constants';

function useGuide() {
	const guide = useAppSelector((state: RootState) => state.guide);
	const { guideType } = guide;
	const dispatch = useAppDispatch();
	const onStartGuide = (guideType: GuideType) => {
		dispatch(updateGuide({ ...guide, guideType }));
	};

	const handleJoyrideCallback = (data: CallBackProps) => {
		const { status } = data;
		const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

		if (finishedStatuses.includes(status)) {
			dispatch(updateGuide({ ...guide, guideType: null }));
		}
	};

	return { guideType, onStartGuide, handleJoyrideCallback };
}

export { useGuide };
