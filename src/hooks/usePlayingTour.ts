import { getTourPhase, setTourPhase } from '@/utils/tourStorage';
import { driver, type Driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const COMPANION_ROUNDS = 3;
const POPOVER_CLASS = 'ghidiem-tour';

/** Fired by the settings dialog so the replay button can reach this hook. */
export const TOUR_REPLAY_EVENT = 'ghidiem:replay-tour';

type Params = {
	/** Number of players in the match; the add-player step waits for 2. */
	playerCount: number;
	/** Current round number (1-based). Companion nudges follow its increments. */
	currentRound?: number;
	/** Tour only runs for the match owner on a live match. */
	isEnabled: boolean;
};

/**
 * Two-phase onboarding tour for PlayingPage.
 *
 * Phase 1 (upfront): spotlight sequence teaching the UI. The add-player step is
 * action-gated -- it has no Next button and advances only once 2 players exist.
 * Phase 2 (companion): the tour steps aside and watches the real match, showing
 * one nudge per genuine round transition until round 3, then congratulates.
 */
function usePlayingTour({ playerCount, currentRound, isEnabled }: Params) {
	const { t } = useTranslation();
	const driverRef = useRef<Driver | null>(null);
	const startedRef = useRef(false);
	const lastNudgedRoundRef = useRef<number | null>(null);
	// Mirror the live values so driver.js callbacks read fresh data.
	const playerCountRef = useRef(playerCount);
	playerCountRef.current = playerCount;
	const currentRoundRef = useRef(currentRound);
	currentRoundRef.current = currentRound;

	const destroy = useCallback(() => {
		driverRef.current?.destroy();
		driverRef.current = null;
	}, []);

	const startBasics = useCallback(() => {
		destroy();
		const hasEnoughPlayers = playerCountRef.current >= 2;
		const instance = driver({
			popoverClass: POPOVER_CLASS,
			showProgress: true,
			progressText: '{{current}}/{{total}}',
			// Steps ask the user to interact with dialogs outside the spotlight
			// (e.g. the add-player dialog), so clicking the overlay must not end
			// the tour. Closing stays available via the ✕ button and Escape.
			overlayClickBehavior: () => {},
			nextBtnText: 'Tiếp',
			prevBtnText: 'Lùi',
			doneBtnText: 'Xong',
			onDestroyed: () => {
				// Skipping mid-sequence ends the tour for good; finishing it hands
				// over to the companion phase (handled in the last step's onDoneClick).
				if (getTourPhase() === 'pending') setTourPhase('done');
				driverRef.current = null;
			},
			steps: [
				{
					popover: {
						title: t('components.tour.welcomeTitle'),
						description: t('components.tour.welcomeDesc'),
					},
				},
				{
					element: '[data-tour="add-player"]',
					popover: {
						title: t('components.tour.addPlayerTitle'),
						description: hasEnoughPlayers
							? t('components.tour.addPlayerDone')
							: t('components.tour.addPlayerDesc'),
						side: 'top',
						align: 'center',
						// Action-gated: without players there is nothing to point at next,
						// so hide Next and let the player watcher call moveNext.
						showButtons: hasEnoughPlayers ? ['next', 'previous', 'close'] : ['previous', 'close'],
					},
				},
				{
					element: '[data-tour="player-score"]',
					popover: {
						title: t('components.tour.scoreTitle'),
						description: t('components.tour.scoreDesc'),
						side: 'bottom',
						align: 'end',
					},
				},
				{
					element: '[data-tour="player-autofill"]',
					popover: {
						title: t('components.tour.autoFillTitle'),
						description: t('components.tour.autoFillDesc'),
						side: 'bottom',
						align: 'end',
					},
				},
				{
					element: '[data-tour="player-gap"]',
					popover: {
						title: t('components.tour.gapTitle'),
						description: t('components.tour.gapDesc'),
						side: 'bottom',
						align: 'start',
					},
				},
				{
					element: '[data-tour="settings"]',
					popover: {
						title: t('components.tour.settingsTitle'),
						description: t('components.tour.settingsDesc'),
						side: 'top',
						align: 'center',
					},
				},
				{
					element: '[data-tour="next-round"]',
					popover: {
						title: t('components.tour.nextRoundTitle'),
						description: t('components.tour.nextRoundDesc'),
						side: 'top',
						align: 'center',
						onDoneClick: () => {
							setTourPhase('basics-done');
							// Baseline the companion phase here: the round the user is on
							// now must not fire a nudge, only the ones they reach next.
							lastNudgedRoundRef.current = currentRoundRef.current ?? null;
							destroy();
						},
					},
				},
			],
		});
		driverRef.current = instance;
		instance.drive();
	}, [destroy, t]);

	const replay = useCallback(() => {
		setTourPhase('pending');
		startedRef.current = true;
		lastNudgedRoundRef.current = null;
		startBasics();
	}, [startBasics]);

	// Auto-start the upfront sequence once per device.
	useEffect(() => {
		if (!isEnabled || startedRef.current) return;
		if (getTourPhase() !== 'pending') return;
		startedRef.current = true;
		startBasics();
	}, [isEnabled, startBasics]);

	// Action gate: advance the add-player step as soon as the match has 2 players.
	useEffect(() => {
		const instance = driverRef.current;
		if (!instance?.isActive() || playerCount < 2) return;
		const isAddPlayerStep =
			(instance.getActiveStep()?.element as string | undefined) === '[data-tour="add-player"]';
		if (isAddPlayerStep) instance.moveNext();
	}, [playerCount]);

	// Companion phase: one nudge per genuine round transition, then congratulate.
	useEffect(() => {
		if (!isEnabled || !currentRound) return;
		if (getTourPhase() !== 'basics-done') return;
		if (driverRef.current?.isActive()) return;
		if (lastNudgedRoundRef.current === null) {
			// Remember where the companion phase picked up so the current round
			// (already reached before this mount) does not fire a nudge.
			lastNudgedRoundRef.current = currentRound;
			return;
		}
		if (currentRound <= lastNudgedRoundRef.current) return;
		lastNudgedRoundRef.current = currentRound;

		const isGraduating = currentRound > COMPANION_ROUNDS;
		const instance = driver({
			popoverClass: POPOVER_CLASS,
			onDestroyed: () => {
				driverRef.current = null;
			},
		});
		driverRef.current = instance;

		if (isGraduating) {
			setTourPhase('done');
			instance.highlight({
				popover: {
					title: t('components.tour.congratsTitle'),
					description: t('components.tour.congratsDesc'),
				},
			});
			return;
		}

		instance.highlight({
			element: '[data-tour="next-round"]',
			popover: {
				title: t('components.tour.companionTitle', { round: currentRound }),
				description: t('components.tour.companionDesc', { round: currentRound }),
				side: 'top',
				align: 'center',
			},
		});
	}, [currentRound, isEnabled, t]);

	useEffect(() => {
		window.addEventListener(TOUR_REPLAY_EVENT, replay);
		return () => window.removeEventListener(TOUR_REPLAY_EVENT, replay);
	}, [replay]);

	useEffect(() => destroy, [destroy]);

	return { replay };
}

export default usePlayingTour;
