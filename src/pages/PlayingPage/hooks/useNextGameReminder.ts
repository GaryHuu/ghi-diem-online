import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { useEffect, useMemo, useRef } from 'react';

const REMINDER_DELAY_MS = 90_000;

type Params = {
	/** A dialog/popover is open, the tour is running, or a next-game call is in flight. */
	isSuppressed: () => boolean;
	onDue: (currentGame: number) => void;
};

/**
 * Watches the current (latest) game and fires `onDue` once it has stayed
 * balanced (sum = 0 with at least one non-zero score) for 90s with no score
 * changes — the player likely forgot to press "Ván mới". At most once per game
 * (in-memory; a reload may remind again). While suppressed, the timer re-arms
 * without burning the game's single reminder.
 */
function useNextGameReminder({ isSuppressed, onDue }: Params) {
	const match = useAppSelector((state: RootState) => state.match.matchDetail);

	const remindedRef = useRef<Set<string>>(new Set());

	// Reassigned every render so the timer callback never reads stale closures.
	const isSuppressedRef = useRef(isSuppressed);
	isSuppressedRef.current = isSuppressed;
	const onDueRef = useRef(onDue);
	onDueRef.current = onDue;

	const matchId = match?.data.id;
	const gameNumber = match?.total;

	const scoreSignature = useMemo(() => {
		if (!match || match.current !== match.total) return '';
		return match.data.players.map((p) => p.scores[match.current - 1] ?? 0).join(',');
	}, [match]);

	const eligible = useMemo(() => {
		if (!match || matchId === undefined || gameNumber === undefined) return false;
		if (match.data.isFinished || match.isShowResult) return false;
		if (match.data.players.length === 0) return false;
		if (match.current !== match.total) return false;
		if (remindedRef.current.has(`${matchId}-${gameNumber}`)) return false;

		const values = match.data.players.map((p) => p.scores[match.current - 1] ?? 0);
		const sum = values.reduce((total, value) => total + value, 0);
		return sum === 0 && values.some((value) => value !== 0);
	}, [match, matchId, gameNumber]);

	const eligibleRef = useRef(eligible);
	eligibleRef.current = eligible;

	useEffect(() => {
		if (!eligible || matchId === undefined || gameNumber === undefined) return;
		// Restart token: any score change resets the countdown.
		void scoreSignature;

		let timer: ReturnType<typeof setTimeout>;
		const arm = () => {
			timer = setTimeout(() => {
				if (!eligibleRef.current) return;
				if (isSuppressedRef.current()) {
					// Another overlay owns the screen: wait a full cycle, keep the turn.
					arm();
					return;
				}
				remindedRef.current.add(`${matchId}-${gameNumber}`);
				onDueRef.current(gameNumber);
			}, REMINDER_DELAY_MS);
		};
		arm();

		return () => clearTimeout(timer);
	}, [eligible, scoreSignature, gameNumber, matchId]);
}

export default useNextGameReminder;
