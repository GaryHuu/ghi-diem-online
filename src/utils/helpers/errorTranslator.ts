import { TFunction } from 'i18next';

/**
 * Translates error messages from service layer
 * @param error - The error object from try-catch
 * @param t - The translation function from useTranslation hook
 * @returns Translated error message
 */
export const translateError = (error: unknown, t: TFunction): string => {
	if (error instanceof Error) {
		const message = error.message;

		// Check if message is a translation key (starts with 'errors.')
		if (typeof message === 'string' && message.startsWith('errors.')) {
			return t(message);
		}

		// Check if message is a JSON string with key and params
		try {
			const parsed = JSON.parse(message);
			if (parsed.key && parsed.params) {
				return t(parsed.key, parsed.params) as string;
			}
		} catch {
			// Not JSON, return as is
		}

		return message;
	}

	return t('errors.unknown');
};
