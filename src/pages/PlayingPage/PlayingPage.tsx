import { ConfirmModal } from '@/components';
import type { ConfirmModalRef, ConfirmOptions } from '@/components/ConfirmModal/ConfirmModal';
import { Hero, PlayingActionBar, PlayingHeader, PlayingLayout } from './components';
import { usePlayingFetcher } from './hooks';
import { useRef } from 'react';

function PlayingPage() {
	const confirmActionRef = useRef<ConfirmModalRef>(null);

	usePlayingFetcher();

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
