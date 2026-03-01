import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';
import type { PortfolioPerformanceResponse } from '$lib/types/api';

const API_URL = env.GOFOLIO_API_URL ?? 'http://localhost:3333';

export const load: PageServerLoad = async ({ locals, parent, url }) => {
	const { user } = await parent();
	const range = url.searchParams.get('range') ?? user.settings.dateRange ?? 'max';
	const token = locals.token!;

	try {
		const res = await fetch(
			`${API_URL}/api/v2/portfolio/performance?range=${encodeURIComponent(range)}`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			}
		);

		if (!res.ok) {
			return { performance: null, chart: [], errors: [], range };
		}

		const data: PortfolioPerformanceResponse = await res.json();
		return {
			performance: data.performance,
			chart: data.chart ?? [],
			errors: data.errors ?? [],
			range
		};
	} catch {
		return { performance: null, chart: [], errors: [], range };
	}
};
