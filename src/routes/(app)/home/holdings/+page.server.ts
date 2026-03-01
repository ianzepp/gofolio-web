import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';
import type { PortfolioHoldingsResponse } from '$lib/types/api';

const API_URL = env.GOFOLIO_API_URL ?? 'http://localhost:3333';

export const load: PageServerLoad = async ({ locals, parent, url }) => {
	const { user } = await parent();
	const range = url.searchParams.get('range') ?? user.settings.dateRange ?? 'max';
	const token = locals.token!;

	try {
		const res = await fetch(
			`${API_URL}/api/v1/portfolio/holdings?range=${encodeURIComponent(range)}`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			}
		);

		if (!res.ok) {
			return { holdings: [], range };
		}

		const data: PortfolioHoldingsResponse = await res.json();
		return { holdings: data.holdings, range };
	} catch {
		return { holdings: [], range };
	}
};
