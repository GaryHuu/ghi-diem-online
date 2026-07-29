import { getDeviceId } from '@/utils/helpers';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type RequestOptions = {
	method?: string;
	body?: unknown;
	skipDeviceId?: boolean;
	headers?: Record<string, string>;
};

export class ApiError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
	}
}

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
	const { method = 'GET', body, skipDeviceId } = options;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...options.headers,
	};
	if (!skipDeviceId) {
		headers['X-Device-Id'] = getDeviceId();
	}

	let response: Response;
	try {
		response = await fetch(`${API_BASE_URL}${path}`, {
			method,
			headers,
			body: body === undefined ? undefined : JSON.stringify(body),
		});
	} catch {
		throw new Error('errors.network');
	}

	if (!response.ok) {
		let message = 'errors.unknown';
		try {
			const errorBody = await response.json();
			message = errorBody.detail || errorBody.message || message;
		} catch {
			// Response body is not JSON, keep the default message
		}
		throw new ApiError(message, response.status);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return response.json() as Promise<T>;
};

const apiClient = {
	get: <T>(path: string, options?: RequestOptions): Promise<T> =>
		request<T>(path, { ...options, method: 'GET' }),
	post: <T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> =>
		request<T>(path, { ...options, method: 'POST', body }),
	put: <T>(path: string, body?: unknown): Promise<T> => request<T>(path, { method: 'PUT', body }),
	delete: <T>(path: string, options?: RequestOptions): Promise<T> =>
		request<T>(path, { ...options, method: 'DELETE' }),
};

export default apiClient;
