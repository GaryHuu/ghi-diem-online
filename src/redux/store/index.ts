import guideReducer from '@/redux/slices/guideSlice';
import matchReducer from '@/redux/slices/matchSlice';
import settingReducer from '@/redux/slices/settingSlice';
import { configureStore } from '@reduxjs/toolkit';
const store = configureStore({
	reducer: {
		match: matchReducer,
		setting: settingReducer,
		guide: guideReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
