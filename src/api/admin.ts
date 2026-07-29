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
	updatedAt: string;
	deviceId: string;
	deletedAt: string | null;
}

export interface AdminMatchPage {
	items: AdminMatchSummary[];
	count: number;
	page: number;
	pageSize: number;
	totalPages: number;
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

// page is 0-based (DataGrid model); the API expects 1-based pages.
export const adminGetMatches = (page: number, pageSize: number): Promise<AdminMatchPage> =>
	withAuthGuard(() =>
		apiClient.get<AdminMatchPage>(`/api/admin/matches?page=${page + 1}&page_size=${pageSize}`, {
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

export const adminDeleteMatch = (id: number): Promise<AdminMatchSummary> =>
	withAuthGuard(() =>
		apiClient.delete<AdminMatchSummary>(`/api/admin/matches/${id}`, {
			skipDeviceId: true,
			headers: authHeaders(),
		}),
	);

export const adminRestoreMatch = (id: number): Promise<AdminMatchSummary> =>
	withAuthGuard(() =>
		apiClient.post<AdminMatchSummary>(
			`/api/admin/matches/${id}/restore`,
			{},
			{ skipDeviceId: true, headers: authHeaders() },
		),
	);
