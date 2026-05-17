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

		let needsUpdate = false;

		// Handle old settings without language field
		if (!data.language) {
			const browserLanguage = navigator.language.split('-')[0];
			const supportedLanguages = ['en', 'vi'];
			data.language = (supportedLanguages.includes(browserLanguage) ? browserLanguage : 'vi') as
				| 'en'
				| 'vi';
			needsUpdate = true;
		}

		// Handle old settings without uiMode field
		if (!data.uiMode) {
			data.uiMode = DEFAULT_SETTING_VALUES.uiMode;
			needsUpdate = true;
		}

		// Handle old settings without colorScheme field
		if (!data.colorScheme) {
			data.colorScheme = DEFAULT_SETTING_VALUES.colorScheme;
			needsUpdate = true;
		}

		if (needsUpdate) {
			helpers.setToLocalStorage(DB_KEYS.SETTING, data);
		}

		return data;
	},
	update: (data: Setting) => {
		helpers.setToLocalStorage(DB_KEYS.SETTING, data);
		return data;
	},
};

export default settingDB;
