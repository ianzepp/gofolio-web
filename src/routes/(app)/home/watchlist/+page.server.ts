import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';
import type { WatchlistResponse } from '$lib/types/api';

const API_URL = env.GOFOLIO_API_URL ?? 'http://localhost:3333';

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token!;

	try {
		const res = await fetch(`${API_URL}/api/v1/watchlist`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		if (!res.ok) {
			return { watchlist: [] };
		}

		const data: WatchlistResponse = await res.json();
		return { watchlist: data.watchlist };
	} catch {
		return { watchlist: [] };
	}
};
