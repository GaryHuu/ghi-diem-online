import { Match } from '@/utils/types';
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
			const player = state.matchDetail?.data.players.find((p) => p.id === action.payload.playerId);
			if (!player) return;
			player.scores[action.payload.gameIndex] = action.payload.value;
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
} = matchSlice.actions;

export default matchSlice.reducer;
