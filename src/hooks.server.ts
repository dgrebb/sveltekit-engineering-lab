import type { Handle } from '@sveltejs/kit/hooks';
import { createSessionId, SESSION_COOKIE } from '#lib/server/mock/session.ts';

/**
 * Issue an anonymous session cookie so mutable fixture state is isolated per visitor.
 * No authentication — the cookie is only a lab isolation key.
 */
export const handle: Handle = async ({ event, resolve }) => {
	let sessionId = event.cookies.get(SESSION_COOKIE);
	if (!sessionId) {
		sessionId = createSessionId();
		event.cookies.set(SESSION_COOKIE, sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: event.url.protocol === 'https:',
			maxAge: 60 * 60
		});
	}
	event.locals.sessionId = sessionId;
	return resolve(event);
};
