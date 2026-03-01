import { env } from '$env/dynamic/private';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const API_URL = env.GOFOLIO_API_URL ?? 'http://localhost:3333';

export const load: PageServerLoad = async ({ parent }) => {
	const { user, info } = await parent();
	return { user, info };
};

export const actions: Actions = {
	updateSettings: async ({ request, locals }) => {
		const token = locals.token;
		if (!token) {
			return fail(401, { action: 'updateSettings', error: 'Not authenticated.' });
		}

		const data = await request.formData();
		const baseCurrency = data.get('baseCurrency');
		const locale = data.get('locale');
		const dateRange = data.get('dateRange');
		const colorScheme = data.get('colorScheme');
		const isRestrictedView = data.get('isRestrictedView') === 'on';

		if (
			typeof baseCurrency !== 'string' ||
			typeof locale !== 'string' ||
			typeof dateRange !== 'string' ||
			typeof colorScheme !== 'string'
		) {
			return fail(400, { action: 'updateSettings', error: 'Invalid settings payload.' });
		}

		const payload = {
			baseCurrency,
			locale,
			dateRange,
			colorScheme,
			isRestrictedView
		};

		const res = await fetch(`${API_URL}/api/v1/user/setting`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(payload)
		});

		if (!res.ok) {
			return fail(res.status, {
				action: 'updateSettings',
				error: 'Unable to update user settings.'
			});
		}

		redirect(303, '/account');
	}
};
