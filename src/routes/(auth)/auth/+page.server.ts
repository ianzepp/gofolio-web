import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { Actions } from './$types';

const API_URL = env.GOFOLIO_API_URL ?? 'http://localhost:3333';

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const accessToken = data.get('accessToken');

		if (!accessToken || typeof accessToken !== 'string' || !accessToken.trim()) {
			return fail(400, { error: 'Security token is required', accessToken: '' });
		}

		try {
			const res = await fetch(`${API_URL}/api/v1/auth/anonymous`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ accessToken: accessToken.trim() })
			});

			if (!res.ok) {
				return fail(401, { error: 'Invalid security token', accessToken });
			}

			const { authToken } = await res.json();

			cookies.set('gofolio_token', authToken, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: url.protocol === 'https:',
				maxAge: 60 * 60 * 24 * 30 // 30 days
			});
		} catch {
			return fail(500, { error: 'Unable to connect to server', accessToken });
		}

		redirect(303, '/home');
	},

	signout: async ({ cookies }) => {
		cookies.delete('gofolio_token', { path: '/' });
		redirect(303, '/auth');
	}
};
