import { getRequestEvent } from '$app/server';

export const SESSION_COOKIE = 'cpl_session';

/** Resolve the anonymous lab session id from the current request event. */
export function getSessionId(): string {
	const event = getRequestEvent();
	const existing = event.cookies.get(SESSION_COOKIE);
	if (existing) return existing;

	const localsId = event.locals.sessionId;
	if (localsId) return localsId;

	throw new Error('Session identifier is missing. Ensure hooks.server.ts issues a session cookie.');
}

export function createSessionId(): string {
	return crypto.randomUUID();
}
