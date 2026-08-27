import { useEffect } from 'react';

let openOverlayCount = 0;

export const hasOpenOverlay = () => openOverlayCount > 0;

/**
 * Registers an overlay while it is open so self-opening UI (e.g. the next-game
 * reminder) can hold off instead of stacking on top of it. The shared Dialog
 * wrapper covers every dialog; overlays that bypass the wrapper (e.g. an MUI
 * Popover) must call this themselves.
 */
export const useOverlayLock = (isOpen: boolean) => {
	useEffect(() => {
		if (!isOpen) return;
		openOverlayCount += 1;
		return () => {
			openOverlayCount -= 1;
		};
	}, [isOpen]);
};
