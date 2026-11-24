import { afterEach, describe, expect, it } from 'vitest';
import {
	clearSessions,
	create,
	get,
	getImmutableSeed,
	list,
	remove,
	reset,
	sessionCount,
	StoreError,
	update
} from '../src/lib/server/mock/store.ts';
import { COLLECTION_NAMES, isCollectionName } from '../src/lib/server/mock/collections.ts';

const A = 'session-a';
const B = 'session-b';

afterEach(() => {
	clearSessions();
});

describe('fixture loading', () => {
	it('loads seed projects', () => {
		const projects = list(A, 'projects');
		expect(projects).toHaveLength(3);
		expect(projects[0]).toMatchObject({ id: 'p1', name: 'control-plane' });
	});

	it('exposes immutable seeds that are not the live array', () => {
		const seed = getImmutableSeed('projects');
		const live = list(A, 'projects');
		expect(seed).toEqual(live);
		expect(seed).not.toBe(live);
	});
});

describe('collection validation', () => {
	it('accepts known collections', () => {
		for (const name of COLLECTION_NAMES) {
			expect(isCollectionName(name)).toBe(true);
			expect(list(A, name).length).toBeGreaterThan(0);
		}
	});

	it('rejects unknown collections', () => {
		expect(() => list(A, 'widgets' as never)).toThrow(StoreError);
		try {
			list(A, 'widgets' as never);
		} catch (error) {
			expect(error).toMatchObject({ code: 'INVALID_COLLECTION', status: 400 });
		}
	});
});

describe('resource CRUD', () => {
	it('retrieves a resource by id', () => {
		expect(get(A, 'agents', 'a2')).toMatchObject({ name: 'Test Generator', status: 'running' });
	});

	it('creates a resource with a generated id', () => {
		const created = create(A, 'projects', {
			name: 'observability',
			status: 'healthy'
		});
		expect(created.id).toBe('p4');
		expect(list(A, 'projects')).toHaveLength(4);
	});

	it('updates a resource', () => {
		const updated = update(A, 'policies', 'policy1', { maxConcurrentRuns: 5 });
		expect(updated.maxConcurrentRuns).toBe(5);
		expect(get(A, 'policies', 'policy1').maxConcurrentRuns).toBe(5);
	});

	it('removes a resource', () => {
		remove(A, 'events', 'e1');
		expect(() => get(A, 'events', 'e1')).toThrow(StoreError);
	});

	it('returns NOT_FOUND for missing resources', () => {
		try {
			get(A, 'agents', 'a99');
			expect.unreachable();
		} catch (error) {
			expect(error).toBeInstanceOf(StoreError);
			expect(error).toMatchObject({
				code: 'NOT_FOUND',
				status: 404,
				message: 'Agent a99 does not exist.'
			});
		}
	});

	it('rejects invalid mutations', () => {
		expect(() =>
			create(A, 'policies', {
				requireApproval: true,
				allowProduction: false,
				maxConcurrentRuns: 0
			})
		).toThrow(StoreError);
	});

	it('conflicts when creating a duplicate id', () => {
		try {
			create(A, 'projects', { id: 'p1', name: 'dup', status: 'healthy' });
			expect.unreachable();
		} catch (error) {
			expect(error).toMatchObject({ code: 'CONFLICT', status: 409 });
		}
	});
});

describe('reset behavior', () => {
	it('resets a single collection', () => {
		update(A, 'agents', 'a1', { enabled: false });
		create(A, 'projects', { name: 'temp', status: 'offline' });
		reset(A, 'agents');
		expect(get(A, 'agents', 'a1').enabled).toBe(true);
		expect(list(A, 'projects')).toHaveLength(4);
	});

	it('resets all collections', () => {
		create(A, 'runs', {
			agentId: 'a1',
			projectId: 'p1',
			status: 'pending',
			progress: 0
		});
		reset(A);
		expect(list(A, 'runs')).toHaveLength(2);
		expect(list(A, 'projects')).toHaveLength(3);
	});
});

describe('pagination and filters', () => {
	it('paginates events', () => {
		const page = list(A, 'events', { limit: 5, offset: 10 });
		expect(page).toHaveLength(5);
		expect(page[0]?.id).toBe('e11');
	});

	it('filters by supported fields', () => {
		const idle = list(A, 'agents', { status: 'idle' });
		expect(idle.map((a) => a.id).sort()).toEqual(['a1', 'a3']);
	});

	it('rejects unsupported filters', () => {
		expect(() => list(A, 'projects', { agentId: 'a1' })).toThrow(StoreError);
	});
});

describe('session isolation', () => {
	it('keeps mutable state per session', () => {
		update(A, 'agents', 'a3', { enabled: true });
		expect(get(A, 'agents', 'a3').enabled).toBe(true);
		expect(get(B, 'agents', 'a3').enabled).toBe(false);
		expect(sessionCount()).toBe(2);
	});

	it('returns copies so callers cannot mutate store state', () => {
		const projects = list(A, 'projects');
		projects[0]!.name = 'mutated';
		expect(get(A, 'projects', 'p1').name).toBe('control-plane');
	});
});

describe('immutable seed data', () => {
	it('does not change seed arrays when sessions mutate', () => {
		const before = getImmutableSeed('projects').map((p) => p.name);
		update(A, 'projects', 'p1', { name: 'changed' });
		expect(getImmutableSeed('projects').map((p) => p.name)).toEqual(before);
	});
});
