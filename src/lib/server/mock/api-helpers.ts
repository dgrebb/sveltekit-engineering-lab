import { StoreError } from './store.ts';
import type { CollectionName } from './collections.ts';
import type { ListOptions } from './store.ts';

export function jsonError(error: unknown): Response {
	if (error instanceof StoreError) {
		return Response.json({ code: error.code, message: error.message }, { status: error.status });
	}
	console.error(error);
	return Response.json(
		{ code: 'INTERNAL_ERROR', message: 'Unexpected server error.' },
		{ status: 500 }
	);
}

export function parseListOptions(url: URL): ListOptions {
	const options: ListOptions = {};
	const limit = url.searchParams.get('limit');
	const offset = url.searchParams.get('offset');
	const status = url.searchParams.get('status');
	const projectId = url.searchParams.get('projectId');
	const agentId = url.searchParams.get('agentId');

	if (limit !== null) {
		const n = Number(limit);
		if (!Number.isInteger(n)) {
			throw new StoreError('INVALID_LIMIT', 'limit must be an integer.', 400);
		}
		options.limit = n;
	}
	if (offset !== null) {
		const n = Number(offset);
		if (!Number.isInteger(n)) {
			throw new StoreError('INVALID_OFFSET', 'offset must be an integer.', 400);
		}
		options.offset = n;
	}
	if (status !== null) options.status = status;
	if (projectId !== null) options.projectId = projectId;
	if (agentId !== null) options.agentId = agentId;

	return options;
}

export type ResetBody = {
	collection?: CollectionName;
};
