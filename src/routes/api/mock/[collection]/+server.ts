import type { RequestHandler } from './$types';
import { isCollectionName } from '#lib/server/mock/collections.ts';
import { jsonError, parseListOptions } from '#lib/server/mock/api-helpers.ts';
import * as store from '#lib/server/mock/store.ts';

export const GET: RequestHandler = async ({ params, url, locals }) => {
	try {
		const { collection } = params;
		if (!isCollectionName(collection)) {
			return Response.json(
				{ code: 'INVALID_COLLECTION', message: `Unknown collection "${collection}".` },
				{ status: 400 }
			);
		}
		const options = parseListOptions(url);
		const items = store.list(locals.sessionId, collection, options);
		return Response.json(items);
	} catch (error) {
		return jsonError(error);
	}
};

export const POST: RequestHandler = async ({ params, request, locals }) => {
	try {
		const { collection } = params;
		if (!isCollectionName(collection)) {
			return Response.json(
				{ code: 'INVALID_COLLECTION', message: `Unknown collection "${collection}".` },
				{ status: 400 }
			);
		}
		const body = await request.json();
		const created = store.create(locals.sessionId, collection, body);
		return Response.json(created, { status: 201 });
	} catch (error) {
		return jsonError(error);
	}
};
