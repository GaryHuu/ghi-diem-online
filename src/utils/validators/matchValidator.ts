import { Match } from '@/utils/types';
import { ERROR_MESSAGES } from '@/utils/constants/errors';

/**
 * Validates that all game scores sum to zero (zero-sum game rule)
 * @param match - The match to validate
 * @param currentGameNumber - The current game number to validate up to
 * @throws Error if any game's total score is not zero
 */
export const validateAllGameScores = (match: Match, currentGameNumber: number): void => {
	if (!match) {
		throw new Error(ERROR_MESSAGES.MATCH_NOT_FOUND);
	}

	if (match.players.length < 2) {
		throw new Error(ERROR_MESSAGES.MATCH_MIN_PLAYERS);
	}

	for (let gameNumberIndex = 0; gameNumberIndex < currentGameNumber; gameNumberIndex++) {
		let total = 0;
		for (let playerIndex = 0; playerIndex < match.players.length; playerIndex++) {
			total += match.players[playerIndex].scores[gameNumberIndex];
		}

		if (total === 0) continue;

		// If it's the current game (last one), use special message
		if (gameNumberIndex === currentGameNumber - 1) {
			throw new Error(ERROR_MESSAGES.GAME_CURRENT_SCORE_NOT_ZERO);
		}

		throw new Error(ERROR_MESSAGES.GAME_SCORE_NOT_ZERO(gameNumberIndex + 1));
	}
};

/**
 * Validates a single game's score sums to zero
 * @param match - The match containing the game
 * @param gameNumber - The game number to validate (1-indexed)
 * @throws Error if the game's total score is not zero
 */
export const validateSingleGameScore = (match: Match, gameNumber: number): void => {
	if (!match) {
		throw new Error(ERROR_MESSAGES.MATCH_NOT_FOUND);
	}

	if (match.players.length === 0) {
		throw new Error(ERROR_MESSAGES.MATCH_MIN_PLAYERS);
	}

	// Check if any player doesn't have scores for this game number
	const hasInvalidScores = match.players.some(
		(player) => !player.scores || player.scores.length < gameNumber,
	);

	if (hasInvalidScores) {
		throw new Error(ERROR_MESSAGES.GAME_NUMBER_INVALID);
	}

	const total = match.players.reduce((acc, player) => acc + player.scores[gameNumber - 1], 0);

	if (total !== 0) {
		throw new Error(ERROR_MESSAGES.GAME_SCORE_NOT_ZERO(gameNumber));
	}
};

/**
 * Validates match ID is valid
 * @param matchId - The match ID to validate
 * @throws Error if match ID is invalid (null, undefined, or NaN)
 */
export const validateMatchId = (matchId: number): void => {
	if (matchId == null || isNaN(matchId)) {
		throw new Error(ERROR_MESSAGES.MATCH_ID_INVALID);
	}
};

/**
 * Validates player ID is valid
 * @param playerId - The player ID to validate
 * @throws Error if player ID is invalid (null, undefined, or NaN)
 */
export const validatePlayerId = (playerId: number): void => {
	if (playerId == null || isNaN(playerId)) {
		throw new Error(ERROR_MESSAGES.PLAYER_ID_INVALID);
	}
};

/**
 * Validates game number is valid
 * @param gameNumber - The game number to validate
 * @throws Error if game number is invalid (null, undefined, NaN, or less than 1)
 */
export const validateGameNumber = (gameNumber: number): void => {
	if (gameNumber == null || isNaN(gameNumber) || gameNumber < 1) {
		throw new Error(ERROR_MESSAGES.GAME_NUMBER_INVALID);
	}
};

/**
 * Validates player name is not empty
 * @param name - The player name to validate
 * @throws Error if name is empty or only whitespace
 */
export const validatePlayerName = (name: string): void => {
	if (!name || !name.trim()) {
		throw new Error(ERROR_MESSAGES.PLAYER_NAME_REQUIRED);
	}
};

/**
 * Validates match name is not empty
 * @param name - The match name to validate
 * @throws Error if name is empty or only whitespace
 */
export const validateMatchName = (name: string): void => {
	if (!name || !name.trim()) {
		throw new Error(ERROR_MESSAGES.MATCH_NAME_REQUIRED);
	}
};
