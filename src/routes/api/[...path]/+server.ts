import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const API_URL = env.GOFOLIO_API_URL ?? 'http://localhost:3333';

export const fallback: RequestHandler = async ({ request, params, cookies, url }) => {
	const token = cookies.get('gofolio_token');
	const query = url.search;
	const upstream = `${API_URL}/api/${params.path}${query}`;

	const headers = new Headers();
	headers.set('content-type', request.headers.get('content-type') ?? 'application/json');
	if (token) {
		headers.set('authorization', `Bearer ${token}`);
	}

	const res = await fetch(upstream, {
		method: request.method,
		headers,
		body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined
	});

	return new Response(res.body, {
		status: res.status,
		statusText: res.statusText,
		headers: {
			'content-type': res.headers.get('content-type') ?? 'application/json'
		}
	});
};
