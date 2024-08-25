import { Setting } from '@/utils/types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateGap, updateUnit } from '@/redux/slices/settingSlice';
import { RootState } from '@/redux/store';
import { settingService } from '@/services';

function useSettingDialog() {
	const settingValue = useAppSelector((state: RootState) => state.setting);
	const dispatch = useAppDispatch();

	const onUnitChange = (newValue: number) => {
		dispatch(updateUnit(newValue));
		const newSetting: Setting = { ...settingValue, unit: newValue };
		settingService.update(newSetting);
	};

	const onGapChange = (newValue: number) => {
		dispatch(updateGap(newValue));
		const newSetting: Setting = { ...settingValue, gap: newValue };
		settingService.update(newSetting);
	};

	return {
		settingValue,
		onUnitChange,
		onGapChange,
	};
}

export default useSettingDialog;
