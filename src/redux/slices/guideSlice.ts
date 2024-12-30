import { GuideType, HOME_GUIDE_STEPS } from '@/components/Guideline/constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Step } from 'react-joyride';

interface GuideState {
	guideType?: GuideType | null;
	steps?: Step[];
	stepIndex?: 0;
}

const initialState: GuideState = {
	guideType: null,
	steps: HOME_GUIDE_STEPS,
	stepIndex: 0,
};

const guideSlice = createSlice({
	name: 'guide',
	initialState,
	reducers: {
		updateGuide: (state, action: PayloadAction<GuideState>) => {
			state.guideType = action.payload.guideType;
		},
	},
});

export const { updateGuide } = guideSlice.actions;

export default guideSlice.reducer;
