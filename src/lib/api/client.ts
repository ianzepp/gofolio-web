import type {
	AccountsResponse,
	AuthResponse,
	BenchmarkResponse,
	InfoResponse,
	PortfolioDetails,
	PortfolioHoldingsResponse,
	PortfolioPerformanceResponse,
	UserResponse,
	WatchlistResponse
} from '$lib/types/api';

export class ApiError extends Error {
	constructor(
		public status: number,
		public body: string
	) {
		super(`API error ${status}: ${body}`);
		this.name = 'ApiError';
	}
}

export async function api<T = unknown>(
	path: string,
	options?: RequestInit & { version?: 'v1' | 'v2' }
): Promise<T> {
	const { version = 'v1', ...fetchOptions } = options ?? {};
	const res = await fetch(`/api/${version}${path}`, {
		...fetchOptions,
		headers: {
			'Content-Type': 'application/json',
			...fetchOptions.headers
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

export const postAuth = (accessToken: string) =>
	api<AuthResponse>('/auth/anonymous', {
		method: 'POST',
		body: JSON.stringify({ accessToken })
	});

export const getInfo = () => api<InfoResponse>('/info');
export const getUser = () => api<UserResponse>('/user');

// Portfolio
export const getPortfolioPerformance = (range: string) =>
	api<PortfolioPerformanceResponse>(`/portfolio/performance?range=${range}`, { version: 'v2' });

export const getPortfolioHoldings = (range?: string) =>
	api<PortfolioHoldingsResponse>(`/portfolio/holdings${range ? `?range=${range}` : ''}`);

export const getPortfolioDetails = () => api<PortfolioDetails>('/portfolio/details');

// Accounts
export const getAccounts = () => api<AccountsResponse>('/account');

// Watchlist
export const getWatchlist = () => api<WatchlistResponse>('/watchlist');

// Benchmarks
export const getBenchmarks = () => api<BenchmarkResponse>('/benchmarks');
