import * as v from 'valibot';
import {
	COLLECTION_NAMES,
	collections,
	getAllSeeds,
	getSeedCopy,
	isCollectionName,
	type CollectionEntityMap,
	type CollectionName,
	type FilterField
} from './collections.ts';

export class StoreError extends Error {
	constructor(
		readonly code: string,
		message: string,
		readonly status: number
	) {
		super(message);
		this.name = 'StoreError';
	}
}

export type ListOptions = {
	limit?: number;
	offset?: number;
	status?: string;
	projectId?: string;
	agentId?: string;
};

type SessionState = {
	data: { [K in CollectionName]: CollectionEntityMap[K][] };
	lastAccess: number;
};

const SESSION_TTL_MS = 1000 * 60 * 60; // 1 hour
const MAX_SESSIONS = 200;

const sessions = new Map<string, SessionState>();

function clone<T>(value: T): T {
	return structuredClone(value);
}

function touch(sessionId: string): SessionState {
	purgeExpired();
	let state = sessions.get(sessionId);
	if (!state) {
		if (sessions.size >= MAX_SESSIONS) {
			evictOldest();
		}
		state = {
			data: getAllSeeds(),
			lastAccess: Date.now()
		};
		sessions.set(sessionId, state);
	} else {
		state.lastAccess = Date.now();
	}
	return state;
}

function purgeExpired(): void {
	const now = Date.now();
	for (const [id, state] of sessions) {
		if (now - state.lastAccess > SESSION_TTL_MS) {
			sessions.delete(id);
		}
	}
}

function evictOldest(): void {
	let oldestId: string | null = null;
	let oldestTime = Infinity;
	for (const [id, state] of sessions) {
		if (state.lastAccess < oldestTime) {
			oldestTime = state.lastAccess;
			oldestId = id;
		}
	}
	if (oldestId) sessions.delete(oldestId);
}

function assertCollection(name: string): CollectionName {
	if (!isCollectionName(name)) {
		throw new StoreError('INVALID_COLLECTION', `Unknown collection "${name}".`, 400);
	}
	return name;
}

function generateId(collection: CollectionName, existing: { id: string }[]): string {
	const prefix = collections[collection].idPrefix;
	let n = existing.length + 1;
	let id = `${prefix}${n}`;
	const ids = new Set(existing.map((item) => item.id));
	while (ids.has(id)) {
		n += 1;
		id = `${prefix}${n}`;
	}
	return id;
}

function applyFilters<T extends Record<string, unknown>>(
	collection: CollectionName,
	items: T[],
	options: ListOptions
): T[] {
	const allowed = new Set(collections[collection].filterFields as readonly FilterField[]);
	let result = items;

	for (const field of ['status', 'projectId', 'agentId'] as const) {
		const value = options[field];
		if (value === undefined) continue;
		if (!allowed.has(field)) {
			throw new StoreError(
				'INVALID_FILTER',
				`Filter "${field}" is not supported for collection "${collection}".`,
				400
			);
		}
		result = result.filter((item) => item[field] === value);
	}

	return result;
}

function paginate<T>(items: T[], options: ListOptions): T[] {
	const offset = options.offset ?? 0;
	const limit = options.limit;

	if (offset < 0) {
		throw new StoreError('INVALID_OFFSET', 'offset must be >= 0.', 400);
	}
	if (limit !== undefined && limit < 0) {
		throw new StoreError('INVALID_LIMIT', 'limit must be >= 0.', 400);
	}

	const sliced = items.slice(offset);
	return limit === undefined ? sliced : sliced.slice(0, limit);
}

function parseInput(collection: CollectionName, data: unknown): Record<string, unknown> {
	const result = v.safeParse(collections[collection].inputSchema, data);
	if (!result.success) {
		const message = result.issues.map((issue) => issue.message).join('; ');
		throw new StoreError('VALIDATION_ERROR', message || 'Invalid request body.', 400);
	}
	return result.output as Record<string, unknown>;
}

export function list<TName extends CollectionName>(
	sessionId: string,
	collection: TName,
	options: ListOptions = {}
): CollectionEntityMap[TName][] {
	const name = assertCollection(collection);
	const state = touch(sessionId);
	const items = state.data[name] as CollectionEntityMap[TName][];
	const filtered = applyFilters(name, items as Record<string, unknown>[], options);
	return clone(paginate(filtered, options)) as CollectionEntityMap[TName][];
}

export function get<TName extends CollectionName>(
	sessionId: string,
	collection: TName,
	id: string
): CollectionEntityMap[TName] {
	const name = assertCollection(collection);
	const state = touch(sessionId);
	const items = state.data[name] as CollectionEntityMap[TName][];
	const found = items.find((item) => item.id === id);
	if (!found) {
		const label = name.replace(/s$/, '');
		throw new StoreError('NOT_FOUND', `${capitalize(label)} ${id} does not exist.`, 404);
	}
	return clone(found);
}

export function create<TName extends CollectionName>(
	sessionId: string,
	collection: TName,
	data: unknown
): CollectionEntityMap[TName] {
	const name = assertCollection(collection);
	const state = touch(sessionId);
	const items = state.data[name] as CollectionEntityMap[TName][];
	const parsed = parseInput(name, data);
	const id = typeof parsed.id === 'string' ? parsed.id : generateId(name, items);

	if (items.some((item) => item.id === id)) {
		throw new StoreError('CONFLICT', `Resource ${id} already exists.`, 409);
	}

	const entity = { ...parsed, id } as CollectionEntityMap[TName];
	const validated = v.safeParse(collections[name].schema, entity);
	if (!validated.success) {
		throw new StoreError('VALIDATION_ERROR', 'Created entity failed validation.', 400);
	}

	items.push(validated.output as CollectionEntityMap[TName]);
	return clone(validated.output as CollectionEntityMap[TName]);
}

export function update<TName extends CollectionName>(
	sessionId: string,
	collection: TName,
	id: string,
	data: unknown
): CollectionEntityMap[TName] {
	const name = assertCollection(collection);
	const state = touch(sessionId);
	const items = state.data[name] as CollectionEntityMap[TName][];
	const index = items.findIndex((item) => item.id === id);
	if (index === -1) {
		const label = name.replace(/s$/, '');
		throw new StoreError('NOT_FOUND', `${capitalize(label)} ${id} does not exist.`, 404);
	}

	if (data === null || typeof data !== 'object' || Array.isArray(data)) {
		throw new StoreError('VALIDATION_ERROR', 'Request body must be an object.', 400);
	}

	const merged = { ...items[index], ...(data as object), id };
	const validated = v.safeParse(collections[name].schema, merged);
	if (!validated.success) {
		const message = validated.issues.map((issue) => issue.message).join('; ');
		throw new StoreError('VALIDATION_ERROR', message || 'Invalid update payload.', 400);
	}

	items[index] = validated.output as CollectionEntityMap[TName];
	return clone(items[index]);
}

export function remove(sessionId: string, collection: CollectionName, id: string): void {
	const name = assertCollection(collection);
	const state = touch(sessionId);
	const items = state.data[name];
	const index = items.findIndex((item) => item.id === id);
	if (index === -1) {
		const label = name.replace(/s$/, '');
		throw new StoreError('NOT_FOUND', `${capitalize(label)} ${id} does not exist.`, 404);
	}
	items.splice(index, 1);
}

export function reset(sessionId: string, collection?: CollectionName): void {
	const state = touch(sessionId);
	if (collection) {
		const name = assertCollection(collection);
		state.data[name] = getSeedCopy(name) as never;
		return;
	}
	state.data = getAllSeeds();
}

/** Test helper: inspect session count without mutating. */
export function sessionCount(): number {
	purgeExpired();
	return sessions.size;
}

/** Test helper: clear all sessions. */
export function clearSessions(): void {
	sessions.clear();
}

/** Immutable seed access for documentation and tests. */
export function getImmutableSeed<TName extends CollectionName>(
	collection: TName
): readonly CollectionEntityMap[TName][] {
	return collections[collection].seed as unknown as readonly CollectionEntityMap[TName][];
}

export { COLLECTION_NAMES, isCollectionName };

function capitalize(value: string): string {
	return value.charAt(0).toUpperCase() + value.slice(1);
}
