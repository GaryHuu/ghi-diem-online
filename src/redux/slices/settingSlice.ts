import { Gap, Language, Setting, Unit } from '@/utils/types';
import { settingService } from '@/services';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: Setting = settingService.get();

const settingSlice = createSlice({
	name: 'setting',
	initialState,
	reducers: {
		updateUnit: (state, action: PayloadAction<Unit>) => {
			state.unit = action.payload;
		},
		updateGap: (state, action: PayloadAction<Gap>) => {
			state.gap = action.payload;
		},
		updateLanguage: (state, action: PayloadAction<Language>) => {
			state.language = action.payload;
		},
	},
});

export const { updateUnit, updateGap, updateLanguage } = settingSlice.actions;

export default settingSlice.reducer;
