import { env } from '$env/dynamic/private';
import type { LayoutServerLoad } from './$types';
import type { PortfolioDetails, PortfolioPerformanceResponse } from '$lib/types/api';

const API_URL = env.GOFOLIO_API_URL ?? 'http://localhost:3333';

export const load: LayoutServerLoad = async ({ locals, parent }) => {
	const token = locals.token!;
	const { user } = await parent();
	const range = user.settings.dateRange ?? 'max';

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`
	};

	try {
		const [detailsRes, performanceRes] = await Promise.all([
			fetch(`${API_URL}/api/v1/portfolio/details`, { headers }),
			fetch(`${API_URL}/api/v2/portfolio/performance?range=${encodeURIComponent(range)}`, { headers })
		]);

		const details: PortfolioDetails | null = detailsRes.ok ? await detailsRes.json() : null;
		const performance: PortfolioPerformanceResponse | null = performanceRes.ok
			? await performanceRes.json()
			: null;

		return { details, performance, range };
	} catch {
		return { details: null, performance: null, range };
	}
};
