import type { RequestHandler } from './$types';
import { isCollectionName } from '#lib/server/mock/collections.ts';
import { jsonError } from '#lib/server/mock/api-helpers.ts';
import * as store from '#lib/server/mock/store.ts';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		let collection: string | undefined;
		const contentType = request.headers.get('content-type') ?? '';
		if (contentType.includes('application/json')) {
			const body = (await request.json()) as { collection?: string };
			collection = body.collection;
		}

		if (collection !== undefined) {
			if (!isCollectionName(collection)) {
				return Response.json(
					{ code: 'INVALID_COLLECTION', message: `Unknown collection "${collection}".` },
					{ status: 400 }
				);
			}
			store.reset(locals.sessionId, collection);
			return Response.json({ reset: collection });
		}

		store.reset(locals.sessionId);
		return Response.json({ reset: 'all' });
	} catch (error) {
		return jsonError(error);
	}
};
