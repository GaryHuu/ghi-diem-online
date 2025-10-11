import matchDB from '@/db/match';
import { Match, MatchWithoutPlayers, Player } from '@/utils/types';
import { ERROR_MESSAGES } from '@/utils/constants/errors';
import {
	validateAllGameScores,
	validateGameNumber,
	validateMatchId,
	validateMatchName,
	validatePlayerId,
	validatePlayerName,
	validateSingleGameScore,
} from '@/utils/validators/matchValidator';
import { isNil } from '@/utils/helpers';
import dayjs from 'dayjs';

/**
 * Creates a new match
 * @param name - The name of the match
 * @returns The created match
 * @throws Error if name is empty
 */
const create = (name: string): Match => {
	validateMatchName(name);

	const newMatchBasicInfo: MatchWithoutPlayers = {
		id: dayjs().valueOf(),
		name,
	};

	return matchDB.createMatch(newMatchBasicInfo);
};

/**
 * Gets a match by ID
 * @param id - The match ID
 * @returns The match
 * @throws Error if match not found
 */
const get = (id: number): Match => {
	const match = matchDB.getMatch(id);

	if (!match) {
		throw new Error(ERROR_MESSAGES.MATCH_NOT_FOUND);
	}

	return match;
};

/**
 * Gets all matches
 * @returns Array of all matches
 */
const getAll = (): Match[] => {
	return matchDB.getMatches();
};

/**
 * Deletes a match by ID
 * @param id - The match ID to delete
 */
const deleteMatch = (id: number): void => {
	matchDB.deleteMatch(id);
};

/**
 * Adds a player to a match
 * @param matchId - The match ID
 * @param name - The player name
 * @returns The created player
 * @throws Error if match ID or name is invalid, or if name already exists
 */
const addPlayer = (matchId: number, name: string): Player => {
	validateMatchId(matchId);
	validatePlayerName(name);

	const currentGameNumber = getCurrentGameNumber(matchId);

	const newPlayer: Player = {
		id: dayjs().valueOf(),
		name,
		scores: Array(currentGameNumber).fill(0),
	};

	const player = matchDB.addPlayerToMatch(matchId, newPlayer);

	if (!player) {
		throw new Error(ERROR_MESSAGES.PLAYER_NAME_EXISTS(name));
	}

	return player;
};

/**
 * Updates a player's name
 * @param matchId - The match ID
 * @param playerId - The player ID
 * @param newName - The new player name
 * @returns The updated player
 * @throws Error if IDs or name are invalid, or if player not found
 */
const updatePlayerName = (matchId: number, playerId: number, newName: string): Player => {
	validateMatchId(matchId);
	validatePlayerId(playerId);
	validatePlayerName(newName);

	const currentPlayer = matchDB.getPlayerOfMatch(matchId, playerId);
	if (!currentPlayer) {
		throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND);
	}

	currentPlayer.name = newName;
	const updatedPlayer = matchDB.updatePlayerOfMatch(matchId, currentPlayer);

	if (!updatedPlayer) {
		throw new Error(ERROR_MESSAGES.PLAYER_NAME_DUPLICATE);
	}

	return updatedPlayer;
};

/**
 * Updates a player's score for a specific game
 * @param matchId - The match ID
 * @param playerId - The player ID
 * @param gameNumber - The game number (1-indexed)
 * @param score - The new score
 * @returns The updated player
 * @throws Error if any parameters are invalid or player not found
 */
const updateScoreOfPlayer = (
	matchId: number,
	playerId: number,
	gameNumber: number,
	score: number,
): Player => {
	validateMatchId(matchId);
	validatePlayerId(playerId);
	validateGameNumber(gameNumber);

	if (isNil(score)) {
		throw new Error(ERROR_MESSAGES.GAME_SCORE_INVALID);
	}

	const currentPlayer = matchDB.getPlayerOfMatch(matchId, playerId);
	if (!currentPlayer) {
		throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND);
	}

	if (gameNumber > currentPlayer.scores.length) {
		throw new Error(ERROR_MESSAGES.GAME_NUMBER_INVALID);
	}

	currentPlayer.scores[gameNumber - 1] = score;

	const updatedPlayer = matchDB.updatePlayerOfMatch(matchId, currentPlayer);

	if (!updatedPlayer) {
		throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND);
	}

	return updatedPlayer;
};

/**
 * Updates the position/order of players in a match
 * @param matchId - The match ID
 * @param players - The reordered players array
 * @throws Error if match ID is invalid
 */
const updatePositionOfPlayer = (matchId: number, players: Player[]): void => {
	validateMatchId(matchId);
	matchDB.updatePlayersPositionOfMatch(matchId, players);
};

/**
 * Gets the current game number for a match
 * @param id - The match ID
 * @returns The current game number (1-indexed)
 * @throws Error if match not found
 */
const getCurrentGameNumber = (id: number): number => {
	const match = matchDB.getMatch(id);

	if (!match) {
		throw new Error(ERROR_MESSAGES.MATCH_NOT_FOUND);
	}

	return match.players.find(Boolean)?.scores.length || 1;
};

/**
 * Validates that a game's scores sum to zero
 * @param matchId - The match ID
 * @param gameNumber - The game number to validate
 * @returns true if valid
 * @throws Error if match not found or scores don't sum to zero
 */
const validateGameNumberScores = (matchId: number, gameNumber: number): boolean => {
	validateMatchId(matchId);

	const match = matchDB.getMatch(matchId);
	if (!match) {
		throw new Error(ERROR_MESSAGES.MATCH_NOT_FOUND);
	}

	validateSingleGameScore(match, gameNumber);

	return true;
};

/**
 * Advances to the next game
 * @param id - The match ID
 * @returns The updated match with new game
 * @throws Error if match not found, has insufficient players, or scores invalid
 */
const nextGame = (id: number): Match => {
	validateMatchId(id);

	const match = matchDB.getMatch(id);
	if (!match) {
		throw new Error(ERROR_MESSAGES.MATCH_NOT_FOUND);
	}

	const currentGameNumber = getCurrentGameNumber(id);
	validateAllGameScores(match, currentGameNumber);

	match.players.forEach((player) => player.scores.push(0));
	matchDB.updatePlayersOfMatch(id, match.players);

	return match;
};

/**
 * Ends the match and marks it as finished
 * @param id - The match ID
 * @returns The finished match
 * @throws Error if match not found, has insufficient players, or scores invalid
 */
const endGame = (id: number): Match => {
	validateMatchId(id);

	const match = matchDB.getMatch(id);
	if (!match) {
		throw new Error(ERROR_MESSAGES.MATCH_NOT_FOUND);
	}

	const currentGameNumber = getCurrentGameNumber(id);
	validateAllGameScores(match, currentGameNumber);

	matchDB.updatePlayersOfMatch(id, match.players);
	matchDB.updateMatch({
		id,
		name: match.name,
		isFinished: true,
	});
	match.isFinished = true;

	return match;
};

const matchService = {
	create,
	get,
	getAll,
	delete: deleteMatch,
	addPlayer,
	updatePlayerName,
	updateScoreOfPlayer,
	updatePositionOfPlayer,
	getCurrentGameNumber,
	validateGameNumber: validateGameNumberScores,
	nextGame,
	endGame,
};

export default matchService;
