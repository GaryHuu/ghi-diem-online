import { Match } from '@/utils/types';
import apiClient, { ApiError } from './client';

export const ADMIN_TOKEN_KEY = 'adminToken';

export interface AdminMatchSummary {
	id: number;
	name: string;
	isFinished: boolean;
	total: number;
	playerCount: number;
	createdAt: string;
	deviceId: string;
}

export interface AdminMatchDetail extends Match {
	total: number;
	current: number;
}

export class AdminAuthError extends Error {}

const authHeaders = (): Record<string, string> => ({
	Authorization: `Bearer ${localStorage.getItem(ADMIN_TOKEN_KEY) ?? ''}`,
});

const withAuthGuard = async <T>(fn: () => Promise<T>): Promise<T> => {
	try {
		return await fn();
	} catch (error) {
		if (error instanceof ApiError && error.status === 401) {
			localStorage.removeItem(ADMIN_TOKEN_KEY);
			throw new AdminAuthError('errors.unauthorized');
		}
		throw error;
	}
};

export const adminLogin = async (username: string, password: string): Promise<string> => {
	const { token } = await apiClient.post<{ token: string }>(
		'/api/admin/login',
		{ username, password },
		{ skipDeviceId: true },
	);
	return token;
};

export const adminGetMatches = (): Promise<AdminMatchSummary[]> =>
	withAuthGuard(() =>
		apiClient.get<AdminMatchSummary[]>('/api/admin/matches', {
			skipDeviceId: true,
			headers: authHeaders(),
		}),
	);

export const adminGetMatch = (id: number): Promise<AdminMatchDetail> =>
	withAuthGuard(() =>
		apiClient.get<AdminMatchDetail>(`/api/admin/matches/${id}`, {
			skipDeviceId: true,
			headers: authHeaders(),
		}),
	);
