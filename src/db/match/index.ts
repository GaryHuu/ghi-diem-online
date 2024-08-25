import { DB_KEYS } from '@/utils/constants';
import { Match, MatchWithoutPlayers, Player } from '@/utils/types';
import helpers from '@/utils/helpers';

const matchDB = {
	// Create a new match
	createMatch: (newMatchBasicInfo: MatchWithoutPlayers): Match => {
		const matchesBasicInfo: MatchWithoutPlayers[] = helpers.getFromLocalStorage<
			MatchWithoutPlayers[]
		>(DB_KEYS.MY_IDS_OF_MATCHES, []);
		matchesBasicInfo.unshift(newMatchBasicInfo);
		helpers.setToLocalStorage(DB_KEYS.MY_IDS_OF_MATCHES, matchesBasicInfo);
		helpers.setToLocalStorage(helpers.getKeyStoragePlayersOfMatch(newMatchBasicInfo.id), []);
		const match: Match = {
			...newMatchBasicInfo,
			players: [],
		};
		return match;
	},
	// Update match
	updateMatch: (match: MatchWithoutPlayers): MatchWithoutPlayers | undefined => {
		const matchesBasicInfo: MatchWithoutPlayers[] = helpers.getFromLocalStorage<
			MatchWithoutPlayers[]
		>(DB_KEYS.MY_IDS_OF_MATCHES, []);
		const index = matchesBasicInfo.findIndex((m) => m.id === match.id);
		if (index === -1) return undefined;
		matchesBasicInfo[index] = {
			id: match.id,
			name: match.name,
			isFinished: match.isFinished,
		};
		helpers.setToLocalStorage(DB_KEYS.MY_IDS_OF_MATCHES, matchesBasicInfo);
		return matchesBasicInfo[index];
	},
	// Get a match by id
	getMatch: (id: number): Match | undefined => {
		const matchesBasicInfo: MatchWithoutPlayers[] = helpers.getFromLocalStorage<
			MatchWithoutPlayers[]
		>(DB_KEYS.MY_IDS_OF_MATCHES, []);
		const matchBasicInfo: MatchWithoutPlayers | undefined = matchesBasicInfo.find(
			(m) => m.id === id,
		);
		if (!matchBasicInfo) return undefined;
		const players: Player[] = helpers.getFromLocalStorage(
			helpers.getKeyStoragePlayersOfMatch(matchBasicInfo.id),
			[],
		);
		const match: Match = {
			...matchBasicInfo,
			players,
		};
		return match;
	},
	// Get all matches
	getMatches: (): Match[] => {
		const matchesBasicInfo: MatchWithoutPlayers[] = helpers.getFromLocalStorage<
			MatchWithoutPlayers[]
		>(DB_KEYS.MY_IDS_OF_MATCHES, []);
		const matches: Match[] = matchesBasicInfo.map((match) => {
			const players = helpers.getFromLocalStorage<Player[]>(
				helpers.getKeyStoragePlayersOfMatch(match.id),
				[],
			);
			return { ...match, players };
		});
		return matches;
	},
	// Add a player to a match
	addPlayerToMatch: (id: number, player: Player) => {
		const players: Player[] = helpers.getFromLocalStorage<Player[]>(
			helpers.getKeyStoragePlayersOfMatch(id),
			[],
		);

		const isExistingName = players.find(
			(p) => p.name.trim().toLowerCase() === player.name.trim().toLowerCase(),
		);

		if (isExistingName) {
			return undefined;
		}

		players.push(player);
		helpers.setToLocalStorage(helpers.getKeyStoragePlayersOfMatch(id), players);

		return player;
	},
	// Get a player of a match by id
	getPlayerOfMatch: (matchId: number, playerId: number): Player | undefined => {
		const players: Player[] = helpers.getFromLocalStorage<Player[]>(
			helpers.getKeyStoragePlayersOfMatch(matchId),
			[],
		);
		return players.find((p) => p.id === playerId);
	},
	// Update a player of a match and return the updated player
	updatePlayerOfMatch: (matchId: number, player: Player): Player | undefined => {
		const players: Player[] = helpers.getFromLocalStorage<Player[]>(
			helpers.getKeyStoragePlayersOfMatch(matchId),
			[],
		);

		const isExistingName = players.find(
			(p) => p.name.trim().toLowerCase() === player.name.trim().toLowerCase() && p.id !== player.id,
		);
		if (isExistingName) return undefined;

		const index = players.findIndex((p) => p.id === player.id);
		if (index === -1) return undefined;
		players[index] = player;
		helpers.setToLocalStorage(helpers.getKeyStoragePlayersOfMatch(matchId), players);
		return player;
	},
	// Update players of a match
	updatePlayersOfMatch: (id: number, players: Player[]) => {
		helpers.setToLocalStorage(helpers.getKeyStoragePlayersOfMatch(id), players);
		return players;
	},
	// Delete a match by id
	deleteMatch: (id: number) => {
		const matchesBasicInfo: MatchWithoutPlayers[] = helpers.getFromLocalStorage<
			MatchWithoutPlayers[]
		>(DB_KEYS.MY_IDS_OF_MATCHES, []);
		const newMatchesBasicInfo = matchesBasicInfo.filter((match) => match.id !== id);
		helpers.setToLocalStorage(DB_KEYS.MY_IDS_OF_MATCHES, newMatchesBasicInfo);
		helpers.removeFromLocalStorage(helpers.getKeyStoragePlayersOfMatch(id));
	},
};

export default matchDB;
