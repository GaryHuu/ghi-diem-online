import matchDB from '@/db/match';
import { Match, Player } from '@/utils/types';
import {
	validateMatchId,
	validateMatchName,
	validatePlayerId,
	validatePlayerName,
} from '@/utils/validators/matchValidator';

/**
 * Creates a new match
 * @param name - The name of the match
 * @returns The created match
 */
const create = (name: string): Promise<Match> => {
	validateMatchName(name);
	return matchDB.createMatch(name);
};

/**
 * Gets a match by ID
 * @param id - The match ID
 * @returns The match
 */
const get = (id: number): Promise<Match> => matchDB.getMatch(id);

/**
 * Gets all matches
 * @returns Array of all matches
 */
const getAll = (): Promise<Match[]> => matchDB.getMatches();

/**
 * Deletes a match by ID
 * @param id - The match ID to delete
 */
const deleteMatch = (id: number): Promise<void> => matchDB.deleteMatch(id);

/**
 * Adds a player to a match
 * @param matchId - The match ID
 * @param name - The player name
 * @returns The updated match snapshot
 */
const addPlayer = (matchId: number, name: string): Promise<Match> => {
	validateMatchId(matchId);
	validatePlayerName(name);
	return matchDB.addPlayerToMatch(matchId, name);
};

/**
 * Updates a player's name, optionally with a new avatar in the same request
 * @param matchId - The match ID
 * @param playerId - The player ID
 * @param newName - The new player name
 * @param avatar - Base64 image string, null to remove, undefined to keep unchanged
 * @returns The updated match snapshot
 */
const updatePlayerName = (
	matchId: number,
	playerId: number,
	newName: string,
	avatar?: string | null,
): Promise<Match> => {
	validateMatchId(matchId);
	validatePlayerId(playerId);
	validatePlayerName(newName);
	return matchDB.updatePlayer(matchId, playerId, {
		name: newName,
		...(avatar !== undefined && { avatar }),
	});
};

/**
 * Updates a player's score for a specific game
 * @param matchId - The match ID
 * @param playerId - The player ID
 * @param gameNumber - The game number (1-indexed)
 * @param score - The new score
 * @returns The updated match snapshot
 */
const updateScoreOfPlayer = (
	matchId: number,
	playerId: number,
	gameNumber: number,
	score: number,
): Promise<Match> => {
	validateMatchId(matchId);
	validatePlayerId(playerId);
	return matchDB.updateScore(matchId, playerId, gameNumber - 1, score);
};

/**
 * Updates the position/order of players in a match
 * @param matchId - The match ID
 * @param players - The reordered players array
 * @returns The updated match snapshot
 */
const updatePositionOfPlayer = (matchId: number, players: Player[]): Promise<Match> => {
	validateMatchId(matchId);
	return matchDB.updatePlayersPosition(matchId, players);
};

/**
 * Advances to the next game
 * @param id - The match ID
 * @returns The updated match snapshot
 */
const nextGame = (id: number): Promise<Match> => {
	validateMatchId(id);
	return matchDB.nextGame(id);
};

/**
 * Ends the match and marks it as finished
 * @param id - The match ID
 * @returns The finished match snapshot
 */
const endGame = (id: number): Promise<Match> => {
	validateMatchId(id);
	return matchDB.endGame(id);
};

/**
 * Toggles autoFill for a player. Only one player can have autoFill at a time.
 * @param matchId - The match ID
 * @param playerId - The player ID
 * @returns The updated match snapshot
 */
const togglePlayerAutoFill = (matchId: number, playerId: number): Promise<Match> => {
	validateMatchId(matchId);
	validatePlayerId(playerId);
	return matchDB.toggleAutoFill(matchId, playerId);
};

/**
 * Updates a player's individual gap value
 * @param matchId - The match ID
 * @param playerId - The player ID
 * @param gap - The new gap value (undefined to use global setting)
 * @returns The updated match snapshot
 */
const updatePlayerGap = (matchId: number, playerId: number, gap?: number): Promise<Match> => {
	validateMatchId(matchId);
	validatePlayerId(playerId);
	return matchDB.updatePlayer(matchId, playerId, { gap });
};

/**
 * Creates (or reuses) a public share link for a match
 * @param id - The match ID
 * @returns The share token
 */
const share = (id: number): Promise<{ token: string }> => {
	validateMatchId(id);
	return matchDB.shareMatch(id);
};

/**
 * Gets a shared match by its public token (no device ownership required)
 * @param token - The share token
 * @returns The match snapshot
 */
const getShared = (token: string): Promise<Match> => matchDB.getSharedMatch(token);

const matchService = {
	create,
	get,
	getAll,
	delete: deleteMatch,
	addPlayer,
	updatePlayerName,
	updateScoreOfPlayer,
	updatePositionOfPlayer,
	updatePlayerGap,
	togglePlayerAutoFill,
	nextGame,
	endGame,
	share,
	getShared,
};

export default matchService;
