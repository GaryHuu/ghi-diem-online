import { DB_KEYS, DEFAULT_SETTING_VALUES } from '@/utils/constants';
import { Match, Player, Setting } from '@/utils/types';
import dayjs from 'dayjs';

// Utility functions for localStorage operations
const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
	try {
		const value = localStorage.getItem(key);
		return value ? JSON.parse(value) : defaultValue;
	} catch (error) {
		console.error(error);
		return defaultValue;
	}
};

const setToLocalStorage = (key: string, value: any) => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.error(error);
	}
};

const removeFromLocalStorage = (key: string) => {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.error(error);
	}
};

// Match-related functions
const getMatches = (): Match[] => {
	return getFromLocalStorage(DB_KEYS.MY_IDS_OF_MATCHES, []);
};

const saveMatches = (matches: Match[]) => {
	setToLocalStorage(DB_KEYS.MY_IDS_OF_MATCHES, matches);
};

const savePlayersToMatch = (matchID: string, players: Player[]) => {
	setToLocalStorage(matchID, []);
};

const getAllMatches = (): Match[] => {
	return getMatches();
};

const createNewMatch = (name: string = ''): Match | null => {
	const newId = dayjs().valueOf();
	const newMatch: Match = { id: newId, name };

	const myCurrentMatches = getMatches();
	saveMatches([newMatch, ...myCurrentMatches]);

	// Set Default Players
	savePlayersToMatch(newId.toString(), []);

	return newMatch;
};

const getMatchByID = (id: number): Match | undefined => {
	const myCurrentMatches = getMatches();
	return myCurrentMatches.find((item) => +item.id === +id);
};

const deleteTheMatch = (id: number): Match[] => {
	try {
		const myCurrentMatches = getMatches();
		const newMatches = myCurrentMatches.filter((match) => match.id !== id);

		saveMatches(newMatches);
		removeFromLocalStorage(id.toString());

		return newMatches;
	} catch (error) {
		console.error(error);
		return [];
	}
};

// Player-related functions
const getPlayersOfMatch = (id: number): Player[] => getFromLocalStorage(id.toString(), []);

const createNewPlayerOfMatch = (matchID: number, name: string = ''): Player | null => {
	try {
		const newId = dayjs().valueOf();
		const newPlayer: Player = { id: newId, name, scores: [] };
		const currentPlayers = getPlayersOfMatch(matchID);

		if (currentPlayers.some((player) => player.name === name)) {
			return null;
		}

		const numberGamesPlayed = currentPlayers.length ? currentPlayers[0].scores.length : 1;
		newPlayer.scores = new Array(numberGamesPlayed).fill(0);

		setToLocalStorage(matchID.toString(), [...currentPlayers, newPlayer]);

		return newPlayer;
	} catch (error) {
		console.error(error);
		return null;
	}
};

const renamePlayerOfMatch = (
	matchID: number,
	playerID: number,
	name: string = '',
): Player[] | null => {
	try {
		const currentPlayers = getPlayersOfMatch(matchID);

		if (currentPlayers.some((player) => player.name === name && player.id !== playerID)) {
			return null;
		}

		const index = currentPlayers.findIndex((player) => player.id === playerID);
		currentPlayers[index].name = name;

		setToLocalStorage(matchID.toString(), currentPlayers);

		return currentPlayers;
	} catch (error) {
		console.error(error);
		return null;
	}
};

const getCurrentGameNumber = (matchID: number): number => {
	const currentPlayers = getPlayersOfMatch(matchID);
	return currentPlayers.length ? currentPlayers[0].scores.length : 1;
};

const changeScorePlayerOfMatch = (
	matchID: number,
	playerID: number,
	gameNumber: number,
	score: number,
): Player[] | null => {
	try {
		const currentPlayers = getPlayersOfMatch(matchID);
		const index = currentPlayers.findIndex((player) => player.id === playerID);

		currentPlayers[index].scores[gameNumber - 1] = score;

		setToLocalStorage(matchID.toString(), currentPlayers);

		return currentPlayers;
	} catch (error) {
		console.error(error);
		return null;
	}
};

const calculateTotalScoreValid = (matchID: number, gameNumber: number): boolean => {
	try {
		const currentPlayers = getPlayersOfMatch(matchID);
		const total = currentPlayers.reduce((acc, player) => acc + player.scores[gameNumber - 1], 0);
		return total === 0;
	} catch (error) {
		console.error(error);
		return false;
	}
};

const createANewGameNumber = (matchID: number): void => {
	try {
		const currentPlayers = getPlayersOfMatch(matchID);
		currentPlayers.forEach((player) => player.scores.push(0));
		setToLocalStorage(matchID.toString(), currentPlayers);
	} catch (error) {
		console.error(error);
	}
};

const calculateTotalScoreValidToFinish = (
	matchID: number,
): { isValid: boolean; gameNumbersInvalid: number[] } | null => {
	try {
		const currentPlayers = getPlayersOfMatch(matchID);
		const totalGameNumber = getCurrentGameNumber(matchID);
		const gameNumbersInvalid: number[] = [];

		for (let gameNumber = 1; gameNumber <= totalGameNumber; gameNumber++) {
			const total = currentPlayers.reduce((acc, player) => acc + player.scores[gameNumber - 1], 0);
			if (total !== 0) {
				gameNumbersInvalid.push(gameNumber);
			}
		}

		return { isValid: gameNumbersInvalid.length === 0, gameNumbersInvalid };
	} catch (error) {
		console.error(error);
		return null;
	}
};

const finishTheMatch = (matchID: number): boolean | null => {
	try {
		const myCurrentMatches = getMatches();
		const index = myCurrentMatches.findIndex((m) => m.id == matchID);

		myCurrentMatches[index].isFinished = true;
		saveMatches(myCurrentMatches);

		return true;
	} catch (error) {
		console.error(error);
		return null;
	}
};

// Setting-related functions
const saveSetting = (value: Setting): void => setToLocalStorage(DB_KEYS.SETTING, value);

const getSetting = (): Setting => {
	try {
		const localStorageValue = getFromLocalStorage(DB_KEYS.SETTING, null);
		if (!localStorageValue) {
			saveSetting(DEFAULT_SETTING_VALUES);
			return DEFAULT_SETTING_VALUES;
		}
		return localStorageValue;
	} catch (error) {
		saveSetting(DEFAULT_SETTING_VALUES);
		return DEFAULT_SETTING_VALUES;
	}
};

export default {
	createNewMatch,
	getAllMatches,
	getMatchByID,
	deleteTheMatch,
	getPlayersOfMatch,
	createNewPlayerOfMatch,
	renamePlayerOfMatch,
	getCurrentGameNumber,
	changeScorePlayerOfMatch,
	calculateTotalScoreValid,
	createANewGameNumber,
	calculateTotalScoreValidToFinish,
	finishTheMatch,
	saveSetting,
	getSetting,
};
