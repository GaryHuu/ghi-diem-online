import { ConfirmModal } from '@/components';
import Guideline from '@/components/Guideline';
import { GuideType, MATCH_GUIDE_STEPS } from '@/components/Guideline/constants';
import { useRef } from 'react';
import { Hero, PlayingHeader, PlayingLayout } from './components';
import { usePlayingFetcher } from './hooks';

function PlayingPage() {
	const confirmActionRef = useRef<{ confirm: (callback: () => void) => void }>();

	usePlayingFetcher();

	const handleConfirm = (callback: () => void) => {
		confirmActionRef.current?.confirm(() => {
			callback();
		});
	};

	return (
		<PlayingLayout>
			<Guideline steps={MATCH_GUIDE_STEPS} type={GuideType.MATCH} />
			<PlayingHeader onConfirm={handleConfirm} />
			<Hero />
			<ConfirmModal ref={confirmActionRef} />
		</PlayingLayout>
	);
}

export default PlayingPage;
