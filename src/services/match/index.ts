import matchDB from '@/db/match';
import { Match, MatchWithoutPlayers, Player } from '@/utils/types';
import helpers from '@/utils/helpers';
import dayjs from 'dayjs';

const matchService = {
	create: (name: string): Match => {
		if (!name) throw new Error('Vui lòng nhập tên trận đấu');

		const newMatchBasicInfo: MatchWithoutPlayers = {
			id: dayjs().valueOf(),
			name,
		};

		return matchDB.createMatch(newMatchBasicInfo);
	},
	get: (id: number): Match => {
		const match = matchDB.getMatch(id);

		if (!match) throw new Error('Trận đấu không tồn tại');

		return match;
	},
	getAll: (): Match[] => {
		return matchDB.getMatches();
	},
	delete: (id: number) => {
		return matchDB.deleteMatch(id);
	},
	addPlayer: function (matchId: number, name: string): Player {
		if (!matchId) throw new Error('ID trận đấu không hợp lệ');
		if (!name) throw new Error('Vui lòng nhập tên người chơi');

		const currentGameNumber = this.getCurrentGameNumber(matchId);

		const newPlayer: Player = {
			id: dayjs().valueOf(),
			name,
			scores: Array(currentGameNumber).fill(0),
		};

		const player = matchDB.addPlayerToMatch(matchId, newPlayer);

		if (!player) throw new Error('Tên người chơi đã tồn tại');

		return player;
	},
	updatePlayerName: (matchId: number, playerId: number, newName: string) => {
		if (!matchId) throw new Error('ID trận đấu không hợp lệ');
		if (!playerId) throw new Error('ID người chơi không hợp lệ');
		if (!newName) throw new Error('Vui lòng nhập tên người chơi');

		const currentPlayer = matchDB.getPlayerOfMatch(matchId, playerId);
		if (!currentPlayer) throw new Error('Không tìm thấy người chơi');

		currentPlayer.name = newName;
		const updatedPlayer = matchDB.updatePlayerOfMatch(matchId, currentPlayer);

		if (!updatedPlayer) throw new Error('Tên người chơi đã tồn tại');

		return updatedPlayer;
	},
	updateScoreOfPlayer: (
		matchId: number,
		playerId: number,
		gameNumber: number,
		score: number,
	): Player => {
		if (!matchId) throw new Error('ID trận đấu không hợp lệ');
		if (!playerId) throw new Error('ID người chơi không hợp lệ');
		if (!gameNumber) throw new Error('Ván đấu không hợp lệ');
		if (helpers.isNil(score)) throw new Error('Điểm số không hợp lệ');

		const currentPlayer = matchDB.getPlayerOfMatch(matchId, playerId);
		if (!currentPlayer) throw new Error('Không tìm thấy người chơi');

		if (gameNumber > currentPlayer.scores.length) {
			throw new Error('Ván đấu không hợp lệ');
		}

		currentPlayer.scores[gameNumber - 1] = score;

		const updatedPlayer = matchDB.updatePlayerOfMatch(matchId, currentPlayer);

		if (!updatedPlayer) throw new Error('Không tìm thấy người chơi');

		return updatedPlayer;
	},
	updatePositionOfPlayer: (matchId: number, players: Player[]) => {
		if (!matchId) throw new Error('ID trận đấu không hợp lệ');
		matchDB.updatePlayersPositionOfMatch(matchId, players);
	},
	getCurrentGameNumber: (id: number): number => {
		const match = matchDB.getMatch(id);

		if (!match) throw new Error('Không tìm thấy trận đấu');

		return match.players.find(Boolean)?.scores.length || 1;
	},
	validateGameNumber: (matchId: number, gameNumber: number) => {
		if (!matchId) throw new Error('ID trận đấu không hợp lệ');

		const match = matchDB.getMatch(matchId);
		if (!match) throw new Error('Không tìm thấy trận đấu');

		const total = match.players.reduce((acc, player) => acc + player.scores[gameNumber - 1], 0);

		if (total !== 0) {
			throw new Error(`Tổng số điểm của ván đấu ${gameNumber} không bằng 0`);
		}

		return true;
	},
	nextGame: function (id: number): Match {
		if (!id) throw new Error('ID trận đấu không hợp lệ');

		const match = matchDB.getMatch(id);
		if (!match) throw new Error('Không tìm thấy trận đấu');

		if (match.players.length < 2) throw new Error('Trận đấu cần ít nhất 2 người chơi');

		const currentGameNumber = this.getCurrentGameNumber(id);
		for (let gameNumberIndex = 0; gameNumberIndex < currentGameNumber; gameNumberIndex++) {
			let total = 0;
			for (let playerIndex = 0; playerIndex < match.players.length; playerIndex++) {
				total += match.players[playerIndex].scores[gameNumberIndex];
			}

			if (total === 0) continue;

			if (gameNumberIndex === currentGameNumber - 1) {
				throw new Error('Tổng số điểm của ván đấu hiện tại không bằng 0');
			}

			if (total !== 0) {
				throw new Error(`Tổng số điểm của ván đấu ${gameNumberIndex + 1} không bằng 0`);
			}
		}

		match.players.forEach((player) => player.scores.push(0));
		matchDB.updatePlayersOfMatch(id, match.players);

		return match;
	},
	endGame: function (id: number): Match {
		if (!id) throw new Error('Không tìm thấy trận đấu');

		const match = matchDB.getMatch(id);
		if (!match) throw new Error('Không tìm thấy trận đấu');

		if (match.players.length < 2) throw new Error('Trận đấu cần ít nhất 2 người chơi');

		const currentGameNumber = this.getCurrentGameNumber(id);
		for (let gameNumberIndex = 0; gameNumberIndex < currentGameNumber; gameNumberIndex++) {
			let total = 0;
			for (let playerIndex = 0; playerIndex < match.players.length; playerIndex++) {
				total += match.players[playerIndex].scores[gameNumberIndex];
			}

			if (total === 0) continue;

			if (gameNumberIndex === currentGameNumber - 1) {
				throw new Error('Tổng số điểm của ván đấu hiện tại không bằng 0');
			}

			if (total !== 0) {
				throw new Error(`Tổng số điểm của ván đấu ${gameNumberIndex + 1} không bằng 0`);
			}
		}

		matchDB.updatePlayersOfMatch(id, match.players);
		matchDB.updateMatch({
			id,
			name: match.name,
			isFinished: true,
		});
		match.isFinished = true;

		return match;
	},
};

export default matchService;
