import { useAddQueryParams } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
	updateCurrentGame,
	updateIsShowResult,
	updateMatchDetail,
	updateMatchDetailData,
	updateMatches,
} from '@/redux/slices/matchSlice';
import { RootState } from '@/redux/store';
import { matchService } from '@/services';
import { getErrorMessage, scrollToTop } from '@/utils/helpers';
import { ErrorType, PlayerLeaderBoard } from '@/utils/types';
import { toast } from 'react-toastify';
import { useMemo } from 'react';

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
				}))
				.sort((a, b) => b.score - a.score),
		[players],
	);

	/**
	 * Refreshes match data from service and updates Redux state
	 */
	const refreshMatchData = (): void => {
		try {
			const updatedMatch = matchService.get(matchId);
			dispatch(updateMatchDetailData(updatedMatch));
		} catch (error) {
			toast.error(getErrorMessage(error as ErrorType));
		}
	};

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

			matchService.validateGameNumber(matchId, match.current);
			dispatch(updateCurrentGame(gameNumber));
			updateQueryParams({ gN: gameNumber.toString() });
		} catch (error) {
			toast.error(getErrorMessage(error as ErrorType));
		}
	};

	/**
	 * Advances to the next game
	 */
	const onPlayContinue = (): void => {
		try {
			const newMatch = matchService.nextGame(matchId);
			const nextGameNumber = match?.total ? match?.total + 1 : 1;
			const payload = {
				current: nextGameNumber,
				total: nextGameNumber,
				data: newMatch,
			};
			dispatch(updateMatchDetail(payload));
			updateQueryParams({ gN: nextGameNumber.toString() });
		} catch (error) {
			toast.error(getErrorMessage(error as ErrorType));
		} finally {
			scrollToTop();
		}
	};

	/**
	 * Finishes the match and shows results
	 */
	const onFinish = (): void => {
		try {
			const finishedMatch = matchService.endGame(matchId);
			dispatch(updateMatchDetailData(finishedMatch));
			toggleShowResult();

			// Refresh matches list to reflect finished status
			const allMatches = matchService.getAll();
			dispatch(updateMatches(allMatches));
		} catch (error) {
			toast.error(getErrorMessage(error as ErrorType));
		} finally {
			scrollToTop();
		}
	};

	/**
	 * Adds a new player or updates existing player name
	 * @param name - Player name
	 * @param id - Player ID (if editing existing player)
	 */
	const onAdjustPlayer = (name: string, id?: number): void => {
		try {
			const isEdit = !!id;

			if (isEdit) {
				matchService.updatePlayerName(matchId, id, name);
			} else {
				matchService.addPlayer(matchId, name);
			}

			refreshMatchData();
		} catch (error) {
			toast.error(getErrorMessage(error as ErrorType));
		}
	};

	/**
	 * Updates a player's score for a specific game
	 * @param playerId - Player ID
	 * @param gameNumber - Game number (1-indexed)
	 * @param score - New score value
	 */
	const onScorePlayerChange = (playerId: number, gameNumber: number, score: number): void => {
		try {
			matchService.updateScoreOfPlayer(matchId, playerId, gameNumber, score);
			refreshMatchData();
		} catch (error) {
			toast.error(getErrorMessage(error as ErrorType));
		}
	};

	/**
	 * Auto-fills a player's score to make the game sum to zero
	 * @param playerId - Player ID to auto-fill
	 * @param gameNumber - Game number (1-indexed)
	 */
	const onAutoFillScore = (playerId: number, gameNumber: number): void => {
		try {
			let score = 0;
			match?.data.players.forEach((p) => {
				if (p.id !== playerId) {
					score = score + p.scores[gameNumber - 1];
				}
			});
			matchService.updateScoreOfPlayer(matchId, playerId, gameNumber, -score);
			refreshMatchData();
		} catch (error) {
			toast.error(getErrorMessage(error as ErrorType));
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
		onAutoFillScore,
		moveToEnd,
		onShowGameNumber,
		onPlayContinue,
		onFinish,
	};
}

export default usePlaying;
