import { Match } from '@/utils/types';
import { matchService } from '@/services';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
	matches: matchService.getAll(),
	matchDetail: undefined,
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
		updateIsShowResult: (state, action: PayloadAction<boolean>) => {
			if (!state.matchDetail) return;
			state.matchDetail.isShowResult = action.payload;
		},
		updateMatchDetail: (state, action: PayloadAction<MatchDetail>) => {
			state.matchDetail = action.payload;
		},
		updateMatches: (state, action: PayloadAction<Match[]>) => {
			state.matches = action.payload;
		},
	},
});

export const {
	updateMatchDetail,
	updateMatches,
	updateCurrentGame,
	updateIsShowResult,
	updateMatchDetailData,
} = matchSlice.actions;

export default matchSlice.reducer;
