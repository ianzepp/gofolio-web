import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { InfoResponse, UserResponse } from '$lib/types/api';

const API_URL = env.GOFOLIO_API_URL ?? 'http://localhost:3333';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	const token = locals.token!;

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`
	};

	const [infoRes, userRes] = await Promise.all([
		fetch(`${API_URL}/api/v1/info`, { headers }),
		fetch(`${API_URL}/api/v1/user`, { headers })
	]);

	// Token expired or invalid — clear and redirect to login
	if (infoRes.status === 401 || userRes.status === 401) {
		cookies.delete('gofolio_token', { path: '/' });
		redirect(302, '/auth');
	}

	const info: InfoResponse = await infoRes.json();
	const user: UserResponse = await userRes.json();

	return { info, user };
};
