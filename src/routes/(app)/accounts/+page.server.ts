import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';
import type { AccountsResponse } from '$lib/types/api';

const API_URL = env.GOFOLIO_API_URL ?? 'http://localhost:3333';

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token!;

	try {
		const res = await fetch(`${API_URL}/api/v1/account`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		if (!res.ok) {
			return { accounts: [], totalValue: 0, totalBalance: 0 };
		}

		const data: AccountsResponse = await res.json();
		return {
			accounts: data.accounts,
			totalValue: data.totalValueInBaseCurrency,
			totalBalance: data.totalBalanceInBaseCurrency
		};
	} catch {
		return { accounts: [], totalValue: 0, totalBalance: 0 };
	}
};
