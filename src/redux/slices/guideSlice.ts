import { GuideType } from '@/components/Guideline/constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Step } from 'react-joyride';

interface GuideState {
	guideType: GuideType | null;
	settingGuide: GuideType[];
}

const initialState: GuideState = {
	guideType: null,
	settingGuide: [],
};

interface GuideAction {
	guideType: GuideType | null;
}

const guideSlice = createSlice({
	name: 'guide',
	initialState,
	reducers: {
		updateGuide: (state, action: PayloadAction<GuideAction>) => {
			state.guideType = action.payload.guideType;

			if (!!action.payload.guideType) {
				if (!state.settingGuide.includes(action.payload.guideType)) {
					state.settingGuide.push(action.payload.guideType);
				}
			}
		},
	},
});

export const { updateGuide } = guideSlice.actions;

export default guideSlice.reducer;
