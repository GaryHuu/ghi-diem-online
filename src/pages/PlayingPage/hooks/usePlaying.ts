import { useAddQueryParams } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
	fetchMatches,
	updateCurrentGame,
	updateIsShowResult,
	updateMatchDetail,
	updateMatchDetailData,
	updatePlayerScore,
} from '@/redux/slices/matchSlice';
import { RootState } from '@/redux/store';
import { matchService } from '@/services';
import { translateError, scrollToTop } from '@/utils/helpers';
import { PlayerLeaderBoard } from '@/utils/types';
import { validateSingleGameScore } from '@/utils/validators/matchValidator';
import { toast } from 'react-toastify';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const SCORE_DEBOUNCE_MS = 400;

/**
 * Custom hook for managing playing page state and operations
 */
function usePlaying() {
	const match = useAppSelector((state: RootState) => state.match.matchDetail);
	const dispatch = useAppDispatch();
	const matchId = match?.data.id as number;
	const isFinished = match?.data.isFinished ?? false;
	const isShowResult = match?.isShowResult ?? false;
	const { updateQueryParams } = useAddQueryParams();
	const { t } = useTranslation();

	/**
	 * One debounce timer per (playerId, gameIndex) score cell so edits to
	 * different cells within the debounce window are not coalesced together.
	 */
	const scoreTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

	useEffect(() => {
		const timers = scoreTimers.current;
		return () => {
			timers.forEach((timer) => clearTimeout(timer));
			timers.clear();
		};
	}, []);

	/**
	 * Memoize players to ensure stable reference and prevent unnecessary recalculations
	 */
	const players = useMemo(() => match?.data.players ?? [], [match?.data.players]);
	const isEmptyPlayer = players.length === 0;

	/**
	 * Calculates and sorts leaderboard players by total score
	 * Memoized to avoid recalculation on every render
	 */
	const leaderBoardPlayers: PlayerLeaderBoard[] = useMemo(
		() =>
			players
				.map((p) => ({
					id: p.id,
					name: p.name,
					score: p.scores.reduce((total, current) => total + current, 0),
					avatar: p.avatar,
				}))
				.sort((a, b) => b.score - a.score),
		[players],
	);

	/**
	 * Moves to the last game in the match
	 */
	const moveToEnd = (): void => {
		if (!match) return;

		const current = match?.total ?? 1;
		updateQueryParams({ gN: current.toString() });
		dispatch(updateCurrentGame(current));
	};

	/**
	 * Shows a specific game number after validating current game
	 * @param gameNumber - The game number to show (1-indexed)
	 */
	const onShowGameNumber = (gameNumber: number): void => {
		try {
			if (!match) return;

			validateSingleGameScore(match.data, match.current);
			dispatch(updateCurrentGame(gameNumber));
			updateQueryParams({ gN: gameNumber.toString() });
		} catch (error) {
			toast.error(translateError(error, t));
		}
	};

	/**
	 * Advances to the next game
	 */
	const onPlayContinue = async (): Promise<void> => {
		try {
			const newMatch = await matchService.nextGame(matchId);
			const nextGameNumber = newMatch.players.find(Boolean)?.scores.length || 1;
			const payload = {
				current: nextGameNumber,
				total: nextGameNumber,
				data: newMatch,
			};
			dispatch(updateMatchDetail(payload));
			updateQueryParams({ gN: nextGameNumber.toString() });
		} catch (error) {
			toast.error(translateError(error, t));
		} finally {
			scrollToTop();
		}
	};

	/**
	 * Finishes the match and shows results
	 */
	const onFinish = async (): Promise<void> => {
		try {
			const finishedMatch = await matchService.endGame(matchId);
			dispatch(updateMatchDetailData(finishedMatch));
			toggleShowResult();
			dispatch(fetchMatches());
		} catch (error) {
			toast.error(translateError(error, t));
		} finally {
			scrollToTop();
		}
	};

	/**
	 * Adds a new player or updates existing player name (and avatar, if changed)
	 * @param name - Player name
	 * @param id - Player ID (if editing existing player)
	 * @param avatar - Base64 string, null to remove, undefined to keep unchanged
	 */
	const onAdjustPlayer = async (
		name: string,
		id?: number,
		avatar?: string | null,
	): Promise<void> => {
		try {
			const updatedMatch = id
				? await matchService.updatePlayerName(matchId, id, name, avatar)
				: await matchService.addPlayer(matchId, name);
			dispatch(updateMatchDetailData(updatedMatch));
		} catch (error) {
			toast.error(translateError(error, t));
		}
	};

	/**
	 * Updates a player's score for a specific game.
	 * Optimistic: redux updates instantly, the API write runs debounced in the
	 * background and its snapshot reconciles server-side effects (autoFill).
	 * @param playerId - Player ID
	 * @param gameNumber - Game number (1-indexed)
	 * @param score - New score value
	 */
	const onScorePlayerChange = (playerId: number, gameNumber: number, score: number): void => {
		dispatch(updatePlayerScore({ playerId, gameIndex: gameNumber - 1, value: score }));

		const key = `${playerId}-${gameNumber}`;
		const timers = scoreTimers.current;

		const existingTimer = timers.get(key);
		if (existingTimer) clearTimeout(existingTimer);

		const timer = setTimeout(async () => {
			timers.delete(key);
			try {
				const updatedMatch = await matchService.updateScoreOfPlayer(
					matchId,
					playerId,
					gameNumber,
					score,
				);
				// Skip reconciling while other cells still have pending writes,
				// otherwise this snapshot would clobber their optimistic values.
				if (timers.size === 0) dispatch(updateMatchDetailData(updatedMatch));
			} catch (error) {
				toast.error(translateError(error, t));
				// Resync so the optimistic value does not silently diverge.
				try {
					dispatch(updateMatchDetailData(await matchService.get(matchId)));
				} catch {
					// Keep the optimistic state; next successful call resyncs.
				}
			}
		}, SCORE_DEBOUNCE_MS);

		timers.set(key, timer);
	};

	/**
	 * Toggles autoFill for a player (only one at a time)
	 * @param playerId - Player ID
	 */
	const onToggleAutoFill = async (playerId: number): Promise<void> => {
		try {
			const updatedMatch = await matchService.togglePlayerAutoFill(matchId, playerId);
			dispatch(updateMatchDetailData(updatedMatch));
		} catch (error) {
			toast.error(translateError(error, t));
		}
	};

	/**
	 * Updates a player's individual gap value
	 * @param playerId - Player ID
	 * @param gap - New gap value (undefined to reset to global)
	 */
	const onUpdatePlayerGap = async (playerId: number, gap?: number): Promise<void> => {
		try {
			const updatedMatch = await matchService.updatePlayerGap(matchId, playerId, gap);
			dispatch(updateMatchDetailData(updatedMatch));
		} catch (error) {
			toast.error(translateError(error, t));
		}
	};

	/**
	 * Toggles the visibility of the result modal
	 */
	const toggleShowResult = (): void => {
		dispatch(updateIsShowResult(!isShowResult));
	};

	return {
		match,
		isEmptyPlayer,
		isFinished,
		isShowResult,
		leaderBoardPlayers,
		toggleShowResult,
		onAdjustPlayer,
		onScorePlayerChange,
		onToggleAutoFill,
		onUpdatePlayerGap,
		moveToEnd,
		onShowGameNumber,
		onPlayContinue,
		onFinish,
	};
}

export default usePlaying;
