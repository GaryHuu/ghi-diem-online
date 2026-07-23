const STORAGE_KEY = 'sharedHistory';
const MAX_ENTRIES = 20;

export interface SharedHistoryEntry {
	token: string;
	name: string;
	viewedAt: string;
}

export const getSharedHistory = (): SharedHistoryEntry[] => {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
	} catch {
		return [];
	}
};

export const saveSharedHistory = (token: string, name: string): void => {
	const entries = getSharedHistory().filter((entry) => entry.token !== token);
	entries.unshift({ token, name, viewedAt: new Date().toISOString() });
	localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
};

export const removeSharedHistory = (token: string): SharedHistoryEntry[] => {
	const entries = getSharedHistory().filter((entry) => entry.token !== token);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
	return entries;
};
