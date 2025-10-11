import { DB_KEYS } from '@/utils/constants';
import { Match, MatchWithoutPlayers, Player } from '@/utils/types';
import {
	getFromLocalStorage,
	setToLocalStorage,
	removeFromLocalStorage,
	getKeyStoragePlayersOfMatch,
} from '@/utils/helpers';

/**
 * Gets all match metadata from localStorage
 * @returns Array of match metadata without players
 */
const getMatchesMetadata = (): MatchWithoutPlayers[] => {
	return getFromLocalStorage<MatchWithoutPlayers[]>(DB_KEYS.MY_IDS_OF_MATCHES, []);
};

/**
 * Saves match metadata to localStorage
 * @param matchesMetadata - Array of match metadata to save
 */
const saveMatchesMetadata = (matchesMetadata: MatchWithoutPlayers[]): void => {
	setToLocalStorage(DB_KEYS.MY_IDS_OF_MATCHES, matchesMetadata);
};

/**
 * Gets players for a specific match from localStorage
 * @param matchId - The match ID
 * @returns Array of players
 */
const getMatchPlayers = (matchId: number): Player[] => {
	return getFromLocalStorage<Player[]>(getKeyStoragePlayersOfMatch(matchId), []);
};

/**
 * Saves players for a specific match to localStorage
 * @param matchId - The match ID
 * @param players - Array of players to save
 */
const saveMatchPlayers = (matchId: number, players: Player[]): void => {
	setToLocalStorage(getKeyStoragePlayersOfMatch(matchId), players);
};

/**
 * Checks if a player name already exists in the match (case-insensitive)
 * @param players - Array of existing players
 * @param name - Name to check
 * @param excludePlayerId - Optional player ID to exclude from check (for updates)
 * @returns true if name exists
 */
const isPlayerNameDuplicate = (
	players: Player[],
	name: string,
	excludePlayerId?: number,
): boolean => {
	return players.some(
		(p) =>
			p.name.trim().toLowerCase() === name.trim().toLowerCase() &&
			(!excludePlayerId || p.id !== excludePlayerId),
	);
};

/**
 * Creates a new match
 * @param newMatchBasicInfo - Match metadata
 * @returns The created match with empty players array
 */
const createMatch = (newMatchBasicInfo: MatchWithoutPlayers): Match => {
	const matchesMetadata = getMatchesMetadata();
	matchesMetadata.unshift(newMatchBasicInfo);
	saveMatchesMetadata(matchesMetadata);
	saveMatchPlayers(newMatchBasicInfo.id, []);

	return {
		...newMatchBasicInfo,
		players: [],
	};
};

/**
 * Updates match metadata
 * @param match - Match metadata to update
 * @returns Updated match metadata or undefined if not found
 */
const updateMatch = (match: MatchWithoutPlayers): MatchWithoutPlayers | undefined => {
	const matchesMetadata = getMatchesMetadata();
	const index = matchesMetadata.findIndex((m) => m.id === match.id);

	if (index === -1) return undefined;

	matchesMetadata[index] = {
		id: match.id,
		name: match.name,
		isFinished: match.isFinished,
	};
	saveMatchesMetadata(matchesMetadata);

	return matchesMetadata[index];
};

/**
 * Gets a match by ID with its players
 * @param id - Match ID
 * @returns Match with players or undefined if not found
 */
const getMatch = (id: number): Match | undefined => {
	const matchesMetadata = getMatchesMetadata();
	const matchMetadata = matchesMetadata.find((m) => m.id === id);

	if (!matchMetadata) return undefined;

	const players = getMatchPlayers(matchMetadata.id);

	return {
		...matchMetadata,
		players,
	};
};

/**
 * Gets all matches with their players
 * @returns Array of all matches
 */
const getMatches = (): Match[] => {
	const matchesMetadata = getMatchesMetadata();

	return matchesMetadata.map((matchMetadata) => {
		const players = getMatchPlayers(matchMetadata.id);
		return { ...matchMetadata, players };
	});
};

/**
 * Adds a player to a match
 * @param id - Match ID
 * @param player - Player to add
 * @returns The added player or undefined if name already exists
 */
const addPlayerToMatch = (id: number, player: Player): Player | undefined => {
	const players = getMatchPlayers(id);

	if (isPlayerNameDuplicate(players, player.name)) {
		return undefined;
	}

	players.push(player);
	saveMatchPlayers(id, players);

	return player;
};

/**
 * Gets a specific player from a match
 * @param matchId - Match ID
 * @param playerId - Player ID
 * @returns Player or undefined if not found
 */
const getPlayerOfMatch = (matchId: number, playerId: number): Player | undefined => {
	const players = getMatchPlayers(matchId);
	return players.find((p) => p.id === playerId);
};

/**
 * Updates a player in a match
 * @param matchId - Match ID
 * @param player - Updated player data
 * @returns Updated player or undefined if not found or name is duplicate
 */
const updatePlayerOfMatch = (matchId: number, player: Player): Player | undefined => {
	const players = getMatchPlayers(matchId);

	if (isPlayerNameDuplicate(players, player.name, player.id)) {
		return undefined;
	}

	const index = players.findIndex((p) => p.id === player.id);
	if (index === -1) return undefined;

	players[index] = player;
	saveMatchPlayers(matchId, players);

	return player;
};

/**
 * Updates all players in a match
 * @param id - Match ID
 * @param players - Updated players array
 * @returns Updated players array
 */
const updatePlayersOfMatch = (id: number, players: Player[]): Player[] => {
	saveMatchPlayers(id, players);
	return players;
};

/**
 * Deletes a match and its players
 * @param id - Match ID
 */
const deleteMatch = (id: number): void => {
	const matchesMetadata = getMatchesMetadata();
	const newMatchesMetadata = matchesMetadata.filter((match) => match.id !== id);
	saveMatchesMetadata(newMatchesMetadata);
	removeFromLocalStorage(getKeyStoragePlayersOfMatch(id));
};

/**
 * Updates the order/position of players in a match
 * @param id - Match ID
 * @param players - Reordered players array
 */
const updatePlayersPositionOfMatch = (id: number, players: Player[]): void => {
	saveMatchPlayers(id, players);
};

const matchDB = {
	createMatch,
	updateMatch,
	getMatch,
	getMatches,
	addPlayerToMatch,
	getPlayerOfMatch,
	updatePlayerOfMatch,
	updatePlayersOfMatch,
	deleteMatch,
	updatePlayersPositionOfMatch,
};

export default matchDB;
