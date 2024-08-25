import { useAddQueryParams } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
	updateCurrentGame,
	updateIsShowResult,
	updateMatchDetail,
	updateMatchDetailData,
} from '@/redux/slices/matchSlice';
import { RootState } from '@/redux/store';
import { matchService } from '@/services';
import helpers from '@/utils/helpers';
import { ErrorType, PlayerLeaderBoard } from '@/utils/types';
import { toast } from 'react-toastify';

function usePlaying() {
	const match = useAppSelector((state: RootState) => state.match.matchDetail);
	const dispatch = useAppDispatch();
	const matchId = match?.data.id as number;
	const players = match?.data.players ?? [];
	const isEmptyPlayer = players.length === 0;
	const isFinished = match?.data.isFinished ?? false;
	const isShowResult = match?.isShowResult ?? false;
	const { updateQueryParams } = useAddQueryParams();

	const leaderBoardPlayers: PlayerLeaderBoard[] = players
		.map((p) => ({
			id: p.id,
			name: p.name,
			score: p.scores.reduce((total, current) => total + current, 0),
		}))
		.sort((a, b) => b.score - a.score);

	const moveToEnd = () => {
		if (!match) return;

		const current = match?.total ?? 1;
		updateQueryParams({ gN: current.toString() });
		dispatch(updateCurrentGame(current));
	};

	const onShowGameNumber = (gameNumber: number) => {
		try {
			if (!match) return;

			matchService.validateGameNumber(matchId, match.current);
			dispatch(updateCurrentGame(gameNumber));
			updateQueryParams({ gN: gameNumber.toString() });
		} catch (error) {
			toast.error(helpers.getErrorMessage(error as ErrorType));
		}
	};

	const onPlayContinue = () => {
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
			toast.error(helpers.getErrorMessage(error as ErrorType));
		} finally {
			helpers.scrollToTop();
		}
	};

	const onFinish = () => {
		try {
			matchService.endGame(matchId);
			const newMatch = matchService.get(matchId);
			dispatch(updateMatchDetailData(newMatch));
			toggleShowResult();
		} catch (error) {
			toast.error(helpers.getErrorMessage(error as ErrorType));
		} finally {
			helpers.scrollToTop();
		}
	};

	const onAdjustPlayer = (name: string, id?: number) => {
		try {
			const isEdit = !!id;

			isEdit
				? matchService.updatePlayerName(matchId, id, name)
				: matchService.addPlayer(matchId, name);

			const newMatch = matchService.get(matchId);
			dispatch(updateMatchDetailData(newMatch));
		} catch (error) {
			toast.error(helpers.getErrorMessage(error as ErrorType));
		}
	};

	const onScorePlayerChange = (playerId: number, gameNumber: number, score: number) => {
		try {
			matchService.updateScoreOfPlayer(matchId, playerId, gameNumber, score);
			const newMatch = matchService.get(matchId);
			dispatch(updateMatchDetailData(newMatch));
		} catch (error) {
			toast.error(helpers.getErrorMessage(error as ErrorType));
		}
	};

	const onAutoFillScore = (playerId: number, gameNumber: number) => {
		try {
			let score = 0;
			match?.data.players.forEach((p) => {
				if (p.id !== playerId) {
					score = score + p.scores[gameNumber - 1];
				}
			});
			matchService.updateScoreOfPlayer(matchId, playerId, gameNumber, -score);

			const newMatch = matchService.get(matchId);
			dispatch(updateMatchDetailData(newMatch));
		} catch (error) {
			toast.error(helpers.getErrorMessage(error as ErrorType));
		}
	};

	const toggleShowResult = () => {
		dispatch(updateIsShowResult(!isShowResult));
	};

	return {
		match,
		players,
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
