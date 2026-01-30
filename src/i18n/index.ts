import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import vi from './locales/vi.json';
import { settingService } from '@/services';

const resources = {
	en: {
		translation: en,
	},
	vi: {
		translation: vi,
	},
};

// Get language from settings in localStorage
const savedSettings = settingService.get();

// Priority: saved setting > default to Vietnamese
const initialLanguage = savedSettings.language || 'vi';

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		lng: initialLanguage,
		fallbackLng: 'vi',
		debug: false,
		interpolation: {
			escapeValue: false,
		},
		detection: {
			// Order of detection methods
			order: ['localStorage', 'navigator'],
			// Cache user language preference
			caches: ['localStorage'],
			lookupLocalStorage: 'i18nextLng',
		},
	});

export default i18n;
