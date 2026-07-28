/**
 * Tour progress, stored per browser (same scope as the device id).
 * pending: never seen -> upfront spotlight sequence runs
 * basics-done: upfront sequence finished -> companion phase watches real rounds
 * done: skipped or fully completed -> nothing auto-starts
 */
export type TourPhase = 'pending' | 'basics-done' | 'done';

const KEY = 'playingTourPhase';

export const getTourPhase = (): TourPhase => {
	const stored = localStorage.getItem(KEY);
	return stored === 'basics-done' || stored === 'done' ? stored : 'pending';
};

export const setTourPhase = (phase: TourPhase) => {
	localStorage.setItem(KEY, phase);
};
