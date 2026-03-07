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

	recalculateAutoFillPlayer(matchId, gameNumber);

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

/**
 * Recalculates the autoFill player's score for a given game
 * @param matchId - The match ID
 * @param gameNumber - The game number (1-indexed)
 */
const recalculateAutoFillPlayer = (matchId: number, gameNumber: number): void => {
	const match = matchDB.getMatch(matchId);
	if (!match) return;

	const autoFillPlayer = match.players.find((p) => p.autoFill);
	if (!autoFillPlayer) return;

	const otherPlayersSum = match.players
		.filter((p) => p.id !== autoFillPlayer.id)
		.reduce((sum, p) => sum + (p.scores[gameNumber - 1] || 0), 0);

	autoFillPlayer.scores[gameNumber - 1] = -otherPlayersSum;
	matchDB.updatePlayerOfMatch(matchId, autoFillPlayer);
};

/**
 * Toggles autoFill for a player. Only one player can have autoFill at a time.
 * @param matchId - The match ID
 * @param playerId - The player ID
 * @param gameNumber - The current game number (1-indexed)
 * @returns The updated match
 */
const togglePlayerAutoFill = (matchId: number, playerId: number, gameNumber: number): Match => {
	validateMatchId(matchId);
	validatePlayerId(playerId);

	const match = matchDB.getMatch(matchId);
	if (!match) {
		throw new Error(ERROR_MESSAGES.MATCH_NOT_FOUND);
	}

	const targetPlayer = match.players.find((p) => p.id === playerId);
	if (!targetPlayer) {
		throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND);
	}

	const isEnabling = !targetPlayer.autoFill;

	// Clear autoFill from all players first
	match.players.forEach((p) => {
		if (p.autoFill) {
			p.autoFill = undefined;
			matchDB.updatePlayerOfMatch(matchId, p);
		}
	});

	if (isEnabling) {
		targetPlayer.autoFill = true;

		// Calculate score immediately
		const otherPlayersSum = match.players
			.filter((p) => p.id !== playerId)
			.reduce((sum, p) => sum + (p.scores[gameNumber - 1] || 0), 0);
		targetPlayer.scores[gameNumber - 1] = -otherPlayersSum;

		matchDB.updatePlayerOfMatch(matchId, targetPlayer);
	}

	return get(matchId);
};

/**
 * Updates a player's individual gap value
 * @param matchId - The match ID
 * @param playerId - The player ID
 * @param gap - The new gap value (undefined to use global setting)
 * @returns The updated player
 * @throws Error if IDs are invalid or player not found
 */
const updatePlayerGap = (matchId: number, playerId: number, gap?: number): Player => {
	validateMatchId(matchId);
	validatePlayerId(playerId);

	const currentPlayer = matchDB.getPlayerOfMatch(matchId, playerId);
	if (!currentPlayer) {
		throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND);
	}

	currentPlayer.gap = gap;
	const updatedPlayer = matchDB.updatePlayerOfMatch(matchId, currentPlayer);

	if (!updatedPlayer) {
		throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND);
	}

	return updatedPlayer;
};

/**
 * Updates a player's avatar
 * @param matchId - The match ID
 * @param playerId - The player ID
 * @param avatar - Base64 image string (undefined to remove)
 * @returns The updated player
 */
const updatePlayerAvatar = (matchId: number, playerId: number, avatar?: string): Player => {
	validateMatchId(matchId);
	validatePlayerId(playerId);

	const currentPlayer = matchDB.getPlayerOfMatch(matchId, playerId);
	if (!currentPlayer) {
		throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND);
	}

	currentPlayer.avatar = avatar;
	const updatedPlayer = matchDB.updatePlayerOfMatch(matchId, currentPlayer);

	if (!updatedPlayer) {
		throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND);
	}

	return updatedPlayer;
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
	updatePlayerGap,
	updatePlayerAvatar,
	togglePlayerAutoFill,
	getCurrentGameNumber,
	validateGameNumber: validateGameNumberScores,
	nextGame,
	endGame,
};

export default matchService;
