import type { RequestHandler } from './$types';
import { isCollectionName } from '#lib/server/mock/collections.ts';
import { jsonError } from '#lib/server/mock/api-helpers.ts';
import * as store from '#lib/server/mock/store.ts';

export const GET: RequestHandler = async ({ params, locals }) => {
	try {
		const { collection, id } = params;
		if (!isCollectionName(collection)) {
			return Response.json(
				{ code: 'INVALID_COLLECTION', message: `Unknown collection "${collection}".` },
				{ status: 400 }
			);
		}
		const item = store.get(locals.sessionId, collection, id);
		return Response.json(item);
	} catch (error) {
		return jsonError(error);
	}
};

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	try {
		const { collection, id } = params;
		if (!isCollectionName(collection)) {
			return Response.json(
				{ code: 'INVALID_COLLECTION', message: `Unknown collection "${collection}".` },
				{ status: 400 }
			);
		}
		const body = await request.json();
		const updated = store.update(locals.sessionId, collection, id, body);
		return Response.json(updated);
	} catch (error) {
		return jsonError(error);
	}
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	try {
		const { collection, id } = params;
		if (!isCollectionName(collection)) {
			return Response.json(
				{ code: 'INVALID_COLLECTION', message: `Unknown collection "${collection}".` },
				{ status: 400 }
			);
		}
		store.remove(locals.sessionId, collection, id);
		return new Response(null, { status: 204 });
	} catch (error) {
		return jsonError(error);
	}
};
