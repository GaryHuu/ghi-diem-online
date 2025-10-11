/**
 * Error messages used throughout the application
 */
export const ERROR_MESSAGES = {
	// Match errors
	MATCH_NAME_REQUIRED: 'Vui lòng nhập tên trận đấu',
	MATCH_NOT_FOUND: 'Không tìm thấy trận đấu',
	MATCH_ID_INVALID: 'ID trận đấu không hợp lệ',
	MATCH_MIN_PLAYERS: 'Trận đấu cần ít nhất 2 người chơi',

	// Player errors
	PLAYER_NAME_REQUIRED: 'Vui lòng nhập tên người chơi',
	PLAYER_NOT_FOUND: 'Không tìm thấy người chơi',
	PLAYER_ID_INVALID: 'ID người chơi không hợp lệ',
	PLAYER_NAME_EXISTS: (name: string) => `Tên người chơi ${name} đã tồn tại`,
	PLAYER_NAME_DUPLICATE: 'Tên người chơi đã tồn tại',

	// Game errors
	GAME_NUMBER_INVALID: 'Ván đấu không hợp lệ',
	GAME_SCORE_INVALID: 'Điểm số không hợp lệ',
	GAME_SCORE_NOT_ZERO: (gameNumber: number) =>
		`Tổng số điểm của ván đấu ${gameNumber} không bằng 0`,
	GAME_CURRENT_SCORE_NOT_ZERO: 'Tổng số điểm của ván đấu hiện tại không bằng 0',
} as const;
