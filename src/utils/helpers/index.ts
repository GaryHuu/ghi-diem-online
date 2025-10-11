import { DB_KEYS } from '@/utils/constants';
import { ErrorType } from '../types';

/**
 * Formats a number as Vietnamese currency
 * @param value - The number to format
 * @returns Formatted string
 */
export const formatCurrency = (value: number): string => {
	return value.toLocaleString('vi-VN');
};

/**
 * Generates a deterministic color from a string
 * @param string - Input string
 * @returns Hex color code
 */
export const stringToColor = (string = ''): string => {
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
};

/**
 * Gets initials from a name (first two words)
 * @param name - Full name
 * @returns Initials (e.g., "John Doe" -> "JD")
 */
export const getShortName = (name: string): string =>
	`${name.split(' ')[0][0]}${name.split(' ')?.[1]?.[0] || ''}`;

/**
 * Safely retrieves and parses a value from localStorage
 * @param key - localStorage key
 * @param defaultValue - Default value if key doesn't exist or parsing fails
 * @returns Parsed value or default
 */
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
	try {
		const value = localStorage.getItem(key);
		return value ? JSON.parse(value) : defaultValue;
	} catch (error) {
		console.error(error);
		return defaultValue;
	}
};

/**
 * Safely stringifies and stores a value in localStorage
 * @param key - localStorage key
 * @param value - Value to store
 */
export const setToLocalStorage = <T>(key: string, value: T): void => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.error(error);
	}
};

/**
 * Safely removes a value from localStorage
 * @param key - localStorage key
 */
export const removeFromLocalStorage = (key: string): void => {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.error(error);
	}
};

/**
 * Generates the localStorage key for a match's players
 * @param id - Match ID
 * @returns localStorage key string
 */
export const getKeyStoragePlayersOfMatch = (id: number): string => {
	return DB_KEYS.MATCH + id;
};

/**
 * Checks if a value is null or undefined
 * @param value - Value to check
 * @returns true if null or undefined
 */
export const isNil = (value: unknown): boolean => value == null;

/**
 * Extracts error message from Error object
 * @param error - Error object
 * @returns Error message string
 */
export const getErrorMessage = (error: ErrorType): string => error?.message ?? '';

/**
 * Smoothly scrolls the window to the top
 */
export const scrollToTop = (): void => {
	window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Export error translator
export { translateError } from './errorTranslator';

// Default export for backward compatibility
const helpers = {
	formatCurrency,
	stringToColor,
	getShortName,
	getFromLocalStorage,
	setToLocalStorage,
	removeFromLocalStorage,
	getKeyStoragePlayersOfMatch,
	isNil,
	getErrorMessage,
	scrollToTop,
};

export default helpers;
