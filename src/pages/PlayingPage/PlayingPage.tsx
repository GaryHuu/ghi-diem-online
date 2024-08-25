import { ConfirmModal } from '@/components';
import { Hero, PlayingHeader, PlayingLayout } from './components';
import { usePlayingFetcher } from './hooks';
import { useRef } from 'react';

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
			<PlayingHeader onConfirm={handleConfirm} />
			<Hero />
			<ConfirmModal ref={confirmActionRef} />
		</PlayingLayout>
	);
}

export default PlayingPage;
