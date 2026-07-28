import { Match, Player } from '@/utils/types';
import { matchService } from '@/services';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MatchDetail {
	isShowResult?: boolean;
	current: number;
	total: number;
	data: Match;
}

interface MatchState {
	matches: Match[];
	matchDetail?: MatchDetail;
}

const initialState: MatchState = {
	matches: [],
	matchDetail: undefined,
};

export const fetchMatches = createAsyncThunk('match/fetchMatches', () => matchService.getAll());

/**
 * Mirrors the backend's autoFill rule: the autoFill player's score for a game
 * is whatever makes that game sum to zero. Keeps the optimistic state in sync
 * with what the API will return.
 */
const recomputeAutoFillScore = (players: Player[], gameIndex: number) => {
	const autoFillPlayer = players.find((p) => p.autoFill);
	if (!autoFillPlayer) return;

	const otherSum = players
		.filter((p) => p.id !== autoFillPlayer.id)
		.reduce((sum, p) => sum + (p.scores[gameIndex] || 0), 0);
	while (autoFillPlayer.scores.length <= gameIndex) autoFillPlayer.scores.push(0);
	autoFillPlayer.scores[gameIndex] = -otherSum;
};

const matchSlice = createSlice({
	name: 'match',
	initialState,
	reducers: {
		updateCurrentGame: (state, action: PayloadAction<number>) => {
			if (!state.matchDetail) return;
			state.matchDetail.current = action.payload;
		},
		updateMatchDetailData: (state, action: PayloadAction<Match>) => {
			if (!state.matchDetail) return;
			state.matchDetail.data = action.payload;
		},
		updatePlayerScore: (
			state,
			action: PayloadAction<{ playerId: number; gameIndex: number; value: number }>,
		) => {
			const players = state.matchDetail?.data.players;
			const player = players?.find((p) => p.id === action.payload.playerId);
			if (!players || !player) return;
			player.scores[action.payload.gameIndex] = action.payload.value;
			recomputeAutoFillScore(players, action.payload.gameIndex);
		},
		toggleAutoFill: (state, action: PayloadAction<number>) => {
			const players = state.matchDetail?.data.players;
			const target = players?.find((p) => p.id === action.payload);
			if (!state.matchDetail || !players || !target) return;

			// Only one autoFill player at a time.
			const isEnabling = !target.autoFill;
			players.forEach((p) => {
				p.autoFill = false;
			});
			if (!isEnabling) return;

			target.autoFill = true;
			// The backend toggles against the latest game, not the one being viewed.
			recomputeAutoFillScore(players, state.matchDetail.total - 1);
		},
		updateIsShowResult: (state, action: PayloadAction<boolean>) => {
			if (!state.matchDetail) return;
			state.matchDetail.isShowResult = action.payload;
		},
		updateMatchDetail: (state, action: PayloadAction<MatchDetail>) => {
			state.matchDetail = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchMatches.fulfilled, (state, action) => {
			state.matches = action.payload;
		});
	},
});

export const {
	updateMatchDetail,
	updateCurrentGame,
	updateIsShowResult,
	updateMatchDetailData,
	updatePlayerScore,
	toggleAutoFill,
} = matchSlice.actions;

export default matchSlice.reducer;
