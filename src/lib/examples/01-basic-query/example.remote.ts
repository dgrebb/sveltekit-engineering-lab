import { query } from '$app/server';
import { getSessionId } from '#lib/server/mock/session.ts';
import * as store from '#lib/server/mock/store.ts';
import type { Project } from '#lib/schemas/entities.ts';

/**
 * Reference remote query: return every project from the session fixture store.
 */
export const getProjects = query(async (): Promise<Project[]> => {
	return store.list(getSessionId(), 'projects');
});
