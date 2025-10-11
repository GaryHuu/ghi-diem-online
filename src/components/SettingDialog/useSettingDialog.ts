import { Language, Setting } from '@/utils/types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateGap, updateLanguage, updateUnit } from '@/redux/slices/settingSlice';
import { RootState } from '@/redux/store';
import { settingService } from '@/services';
import { useTranslation } from 'react-i18next';

function useSettingDialog() {
	const settingValue = useAppSelector((state: RootState) => state.setting);
	const dispatch = useAppDispatch();
	const { i18n } = useTranslation();

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

	const onLanguageChange = (newValue: string) => {
		const language = newValue as Language;
		dispatch(updateLanguage(language));
		const newSetting: Setting = { ...settingValue, language };
		settingService.update(newSetting);
		i18n.changeLanguage(language);
	};

	return {
		settingValue,
		onUnitChange,
		onGapChange,
		onLanguageChange,
	};
}

export default useSettingDialog;
