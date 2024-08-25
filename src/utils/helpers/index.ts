import { DB_KEYS } from '@/utils/constants';
import { ErrorType } from '../types';

const helpers = {
	formatCurrency(value: number): string {
		return value.toLocaleString('vi-VN');
	},
	stringToColor: (string = '') => {
		let hash = 0;
		let i;

		for (i = 0; i < string.length; i += 1) {
			hash = string.charCodeAt(i) + ((hash << 5) - hash);
		}

		let color = '#';

		for (i = 0; i < 3; i += 1) {
			const value = (hash >> (i * 8)) & 0xff;
			color += `00${value.toString(16)}`.slice(-2);
		}

		return color;
	},
	getShortName: (name: string): string =>
		`${name.split(' ')[0][0]}${name.split(' ')?.[1]?.[0] || ''}`,
	getFromLocalStorage: <T>(key: string, defaultValue: T): T => {
		try {
			const value = localStorage.getItem(key);
			return value ? JSON.parse(value) : defaultValue;
		} catch (error) {
			console.error(error);
			return defaultValue;
		}
	},
	setToLocalStorage: <T>(key: string, value: T) => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(error);
		}
	},
	removeFromLocalStorage: (key: string) => {
		try {
			localStorage.removeItem(key);
		} catch (error) {
			console.error(error);
		}
	},
	getKeyStoragePlayersOfMatch: (id: number): string => {
		return DB_KEYS.MATCH + id;
	},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	isNil: (value: any): boolean => value == null,
	getErrorMessage: (error: ErrorType) => error?.message ?? '',
	scrollToTop: () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	},
};

export default helpers;
