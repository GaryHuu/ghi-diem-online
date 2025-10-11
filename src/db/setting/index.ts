import { DB_KEYS, DEFAULT_SETTING_VALUES } from '@/utils/constants';
import { Setting } from '@/utils/types';
import helpers from '@/utils/helpers';

const settingDB = {
	get: (): Setting => {
		const data = helpers.getFromLocalStorage<Setting | null>(DB_KEYS.SETTING, null);

		if (!data) {
			// Detect browser language for first-time users
			const browserLanguage = navigator.language.split('-')[0];
			const supportedLanguages = ['en', 'vi'];
			const detectedLanguage = supportedLanguages.includes(browserLanguage)
				? browserLanguage
				: 'vi';

			const initialSettings: Setting = {
				...DEFAULT_SETTING_VALUES,
				language: detectedLanguage as 'en' | 'vi',
			};

			helpers.setToLocalStorage(DB_KEYS.SETTING, initialSettings);
			return initialSettings;
		}

		// Handle old settings without language field
		if (!data.language) {
			const browserLanguage = navigator.language.split('-')[0];
			const supportedLanguages = ['en', 'vi'];
			const detectedLanguage = supportedLanguages.includes(browserLanguage)
				? browserLanguage
				: 'vi';

			const updatedData: Setting = {
				...data,
				language: detectedLanguage as 'en' | 'vi',
			};
			helpers.setToLocalStorage(DB_KEYS.SETTING, updatedData);
			return updatedData;
		}

		return data;
	},
	update: (data: Setting) => {
		helpers.setToLocalStorage(DB_KEYS.SETTING, data);
		return data;
	},
};

export default settingDB;
