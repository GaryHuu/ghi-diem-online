/**
 * Error translation keys used throughout the application
 * These keys map to translations in i18n locale files
 */
export const ERROR_MESSAGES = {
	// Match errors
	MATCH_NAME_REQUIRED: 'errors.match.nameRequired',
	MATCH_NOT_FOUND: 'errors.match.notFound',
	MATCH_ID_INVALID: 'errors.match.invalidId',
	MATCH_MIN_PLAYERS: 'errors.match.minPlayers',

	// Player errors
	PLAYER_NAME_REQUIRED: 'errors.player.nameRequired',
	PLAYER_NOT_FOUND: 'errors.player.notFound',
	PLAYER_ID_INVALID: 'errors.player.invalidId',
	PLAYER_NAME_EXISTS: (name: string) =>
		JSON.stringify({ key: 'errors.player.nameExistsWithName', params: { name } }),
	PLAYER_NAME_DUPLICATE: 'errors.player.nameExists',

	// Game errors
	GAME_NUMBER_INVALID: 'errors.game.invalidNumber',
	GAME_SCORE_INVALID: 'errors.game.invalidScore',
	GAME_SCORE_NOT_ZERO: (gameNumber: number) =>
		JSON.stringify({ key: 'errors.game.scoreNotZeroWithNumber', params: { gameNumber } }),
	GAME_CURRENT_SCORE_NOT_ZERO: 'errors.game.scoreNotZero',
} as const;
