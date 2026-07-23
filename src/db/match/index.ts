import { apiClient } from '@/api';
import { Match, Player } from '@/utils/types';

// avatar: null explicitly clears it server-side (undefined would be dropped by JSON.stringify)
type PlayerUpdate = Partial<Pick<Player, 'name' | 'gap'>> & {
	avatar?: string | null;
	order?: number;
};

const getMatches = (): Promise<Match[]> => apiClient.get<Match[]>('/api/matches');

const getMatch = (id: number): Promise<Match> => apiClient.get<Match>(`/api/matches/${id}`);

const createMatch = (name: string): Promise<Match> =>
	apiClient.post<Match>('/api/matches', { name, players: [] });

const deleteMatch = (id: number): Promise<void> => apiClient.delete<void>(`/api/matches/${id}`);

const addPlayerToMatch = (matchId: number, name: string): Promise<Match> =>
	apiClient.post<Match>(`/api/matches/${matchId}/players`, { name });

const updatePlayer = (matchId: number, playerId: number, data: PlayerUpdate): Promise<Match> =>
	apiClient.put<Match>(`/api/matches/${matchId}/players/${playerId}`, data);

const updateScore = (
	matchId: number,
	playerId: number,
	gameIndex: number,
	value: number,
): Promise<Match> =>
	apiClient.put<Match>(`/api/matches/${matchId}/scores`, { playerId, gameIndex, value });

const updatePlayersPosition = async (matchId: number, players: Player[]): Promise<Match> => {
	let match: Match | undefined;
	for (let index = 0; index < players.length; index++) {
		match = await updatePlayer(matchId, players[index].id, { order: index });
	}
	return match ?? getMatch(matchId);
};

const toggleAutoFill = (matchId: number, playerId: number): Promise<Match> =>
	apiClient.post<Match>(`/api/matches/${matchId}/players/${playerId}/toggle-autofill`);

const nextGame = (id: number): Promise<Match> =>
	apiClient.post<Match>(`/api/matches/${id}/next-game`);

const endGame = (id: number): Promise<Match> =>
	apiClient.post<Match>(`/api/matches/${id}/end-game`);

const shareMatch = (id: number): Promise<{ token: string }> =>
	apiClient.post<{ token: string }>(`/api/matches/${id}/share`);

const getSharedMatch = (token: string): Promise<Match> =>
	apiClient.get<Match>(`/api/shared/${token}`, { skipDeviceId: true });

const matchDB = {
	getMatches,
	getMatch,
	createMatch,
	deleteMatch,
	addPlayerToMatch,
	updatePlayer,
	updateScore,
	updatePlayersPosition,
	toggleAutoFill,
	nextGame,
	endGame,
	shareMatch,
	getSharedMatch,
};

export default matchDB;
