import { env } from '$env/dynamic/private';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
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
			return { accounts: [], activitiesCount: 0, totalValue: 0, totalBalance: 0 };
		}

		const data: AccountsResponse = await res.json();
		return {
			accounts: data.accounts,
			activitiesCount: data.activitiesCount,
			totalValue: data.totalValueInBaseCurrency,
			totalBalance: data.totalBalanceInBaseCurrency
		};
	} catch {
		return { accounts: [], activitiesCount: 0, totalValue: 0, totalBalance: 0 };
	}
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const token = locals.token;
		if (!token) {
			return fail(401, { action: 'create', error: 'Not authenticated.' });
		}

		const data = await request.formData();
		const name = data.get('name');
		const currency = data.get('currency');
		const balanceRaw = data.get('balance');
		const commentRaw = data.get('comment');
		const isExcluded = data.get('isExcluded') === 'on';

		if (typeof name !== 'string' || !name.trim()) {
			return fail(400, { action: 'create', error: 'Account name is required.' });
		}

		if (typeof currency !== 'string' || !currency.trim()) {
			return fail(400, { action: 'create', error: 'Currency is required.' });
		}

		const balance = Number(balanceRaw ?? 0);
		if (!Number.isFinite(balance)) {
			return fail(400, { action: 'create', error: 'Balance must be a valid number.' });
		}

		const response = await fetch(`${API_URL}/api/v1/account`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				name: name.trim(),
				currency: currency.trim(),
				balance,
				comment:
					typeof commentRaw === 'string' && commentRaw.trim().length > 0 ? commentRaw.trim() : null,
				isExcluded,
				platformId: null
			})
		});

		if (!response.ok) {
			return fail(response.status, { action: 'create', error: 'Unable to create account.' });
		}

		redirect(303, '/accounts');
	},
	update: async ({ request, locals }) => {
		const token = locals.token;
		if (!token) {
			return fail(401, { action: 'update', error: 'Not authenticated.' });
		}

		const data = await request.formData();
		const accountId = data.get('accountId');
		const name = data.get('name');
		const currency = data.get('currency');
		const balanceRaw = data.get('balance');
		const commentRaw = data.get('comment');
		const isExcluded = data.get('isExcluded') === 'on';

		if (typeof accountId !== 'string' || !accountId.trim()) {
			return fail(400, { action: 'update', error: 'Account id is required.' });
		}

		if (typeof name !== 'string' || !name.trim()) {
			return fail(400, { action: 'update', error: 'Account name is required.' });
		}

		if (typeof currency !== 'string' || !currency.trim()) {
			return fail(400, { action: 'update', error: 'Currency is required.' });
		}

		const balance = Number(balanceRaw ?? 0);
		if (!Number.isFinite(balance)) {
			return fail(400, { action: 'update', error: 'Balance must be a valid number.' });
		}

		const response = await fetch(`${API_URL}/api/v1/account/${accountId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				id: accountId,
				name: name.trim(),
				currency: currency.trim(),
				balance,
				comment:
					typeof commentRaw === 'string' && commentRaw.trim().length > 0 ? commentRaw.trim() : null,
				isExcluded,
				platformId: null
			})
		});

		if (!response.ok) {
			return fail(response.status, { action: 'update', error: 'Unable to update account.' });
		}

		redirect(303, '/accounts');
	},
	delete: async ({ request, locals }) => {
		const token = locals.token;
		if (!token) {
			return fail(401, { action: 'delete', error: 'Not authenticated.' });
		}

		const data = await request.formData();
		const accountId = data.get('accountId');

		if (typeof accountId !== 'string' || !accountId.trim()) {
			return fail(400, { action: 'delete', error: 'Account id is required.' });
		}

		const response = await fetch(`${API_URL}/api/v1/account/${accountId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		if (!response.ok) {
			return fail(response.status, { action: 'delete', error: 'Unable to delete account.' });
		}

		redirect(303, '/accounts');
	},
	transfer: async ({ request, locals }) => {
		const token = locals.token;
		if (!token) {
			return fail(401, { action: 'transfer', error: 'Not authenticated.' });
		}

		const data = await request.formData();
		const accountIdFrom = data.get('accountIdFrom');
		const accountIdTo = data.get('accountIdTo');
		const balanceRaw = data.get('balance');

		if (
			typeof accountIdFrom !== 'string' ||
			!accountIdFrom.trim() ||
			typeof accountIdTo !== 'string' ||
			!accountIdTo.trim()
		) {
			return fail(400, {
				action: 'transfer',
				error: 'Both source and destination accounts are required.'
			});
		}

		if (accountIdFrom === accountIdTo) {
			return fail(400, {
				action: 'transfer',
				error: 'Source and destination accounts must be different.'
			});
		}

		const balance = Number(balanceRaw ?? 0);
		if (!Number.isFinite(balance)) {
			return fail(400, { action: 'transfer', error: 'Transfer amount must be a valid number.' });
		}

		const response = await fetch(`${API_URL}/api/v1/account/transfer-balance`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				accountIdFrom,
				accountIdTo,
				balance
			})
		});

		if (!response.ok) {
			return fail(response.status, {
				action: 'transfer',
				error: 'Cash balance transfer failed.'
			});
		}

		redirect(303, '/accounts');
	}
};
