import { ConfirmModal } from '@/components';
import type { ConfirmModalRef, ConfirmOptions } from '@/components/ConfirmModal/ConfirmModal';
import { hasOpenOverlay } from '@/components/Dialog/openDialogRegistry';
import { usePlayingTour } from '@/hooks';
import { Hero, PlayingActionBar, PlayingHeader, PlayingLayout } from './components';
import { useNextGameReminder, usePlaying, usePlayingFetcher } from './hooks';
import { useRef } from 'react';

function PlayingPage() {
	const confirmActionRef = useRef<ConfirmModalRef>(null);
	const { match, onPlayContinue } = usePlaying();

	usePlayingFetcher();
	const { isTourActive } = usePlayingTour({
		playerCount: match?.data.players.length ?? 0,
		currentRound: match?.current,
		// Only the owner's live match is a valid tour stage (never share/dashboard,
		// never a finished match).
		isEnabled: !!match && !match.data.isFinished,
		// Auto-start only on a brand new match. Someone dropping into a game
		// already in progress should not be walked through "add players".
		canAutoStart: match?.total === 1,
	});

	// True while a confirmed callback (e.g. next game) is still in flight, so the
	// reminder cannot fire between the dialog closing and the round advancing.
	const isAdvancingRef = useRef(false);

	const handleConfirm = (callback: () => void | Promise<void>, options?: ConfirmOptions) => {
		confirmActionRef.current?.confirm(async () => {
			isAdvancingRef.current = true;
			try {
				await callback();
			} finally {
				isAdvancingRef.current = false;
			}
		}, options);
	};

	useNextGameReminder({
		isSuppressed: () => hasOpenOverlay() || isTourActive() || isAdvancingRef.current,
		onDue: (current) =>
			handleConfirm(onPlayContinue, {
				titleKey: 'pages.playing.remindNextRoundTitle',
				bodyKey: 'pages.playing.remindNextRoundBody',
				bodyParams: { current },
				confirmKey: 'pages.playing.remindNextRoundConfirm',
				cancelKey: 'pages.playing.remindNextRoundDismiss',
				autoFocusCancel: true,
			}),
	});

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
