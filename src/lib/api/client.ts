const API_BASE = '/api/v1';

export class ApiError extends Error {
	constructor(
		public status: number,
		public body: string
	) {
		super(`API error ${status}: ${body}`);
		this.name = 'ApiError';
	}
}

export async function api<T = unknown>(path: string, options?: RequestInit): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options?.headers
		}
	});

	if (!res.ok) {
		throw new ApiError(res.status, await res.text());
	}

	if (res.status === 204) {
		return undefined as T;
	}

	return res.json();
}

export const getInfo = () => api('/info');
export const getUser = () => api('/user');
