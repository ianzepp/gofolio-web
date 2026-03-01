import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('gofolio_token');
	event.locals.token = token ?? null;

	const { pathname } = event.url;

	// Public paths that don't require auth
	const isPublic = pathname.startsWith('/auth') || pathname.startsWith('/api/');

	// Redirect unauthenticated users to login
	if (!isPublic && !token) {
		redirect(302, '/auth');
	}

	// Redirect authenticated users away from login (GET only — allow POST for signout action)
	if (pathname.startsWith('/auth') && token && event.request.method === 'GET') {
		redirect(302, '/home');
	}

	return resolve(event);
};
