import { ConfirmModal } from '@/components';
import type { ConfirmModalRef, ConfirmOptions } from '@/components/ConfirmModal/ConfirmModal';
import { usePlayingTour } from '@/hooks';
import { Hero, PlayingActionBar, PlayingHeader, PlayingLayout } from './components';
import { usePlaying, usePlayingFetcher } from './hooks';
import { useRef } from 'react';

function PlayingPage() {
	const confirmActionRef = useRef<ConfirmModalRef>(null);
	const { match } = usePlaying();

	usePlayingFetcher();
	usePlayingTour({
		playerCount: match?.data.players.length ?? 0,
		currentRound: match?.current,
		// Only the owner's live match is a valid tour stage (never share/dashboard,
		// never a finished match).
		isEnabled: !!match && !match.data.isFinished,
	});

	const handleConfirm = (callback: () => void, options?: ConfirmOptions) => {
		confirmActionRef.current?.confirm(() => {
			callback();
		}, options);
	};

	return (
		<PlayingLayout>
			<PlayingHeader />
			<Hero />
			<PlayingActionBar onConfirm={handleConfirm} />
			<ConfirmModal ref={confirmActionRef} />
		</PlayingLayout>
	);
}

export default PlayingPage;
