import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('gofolio_token');
	event.locals.token = token ?? null;

	return resolve(event);
};
