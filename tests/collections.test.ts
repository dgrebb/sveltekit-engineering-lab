import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as v from 'valibot';
import {
	AgentSchema,
	ApprovalSchema,
	CapabilitySchema,
	EventSchema,
	MetricSchema,
	PolicySchema,
	ProjectSchema,
	ReadinessSchema,
	RunSchema
} from '../src/lib/schemas/entities.ts';
import { COLLECTION_NAMES, collections } from '../src/lib/server/mock/collections.ts';

const fixtureDir = join(process.cwd(), 'src/lib/mock/fixtures');

const schemas = {
	projects: ProjectSchema,
	agents: AgentSchema,
	policies: PolicySchema,
	runs: RunSchema,
	approvals: ApprovalSchema,
	readiness: ReadinessSchema,
	metrics: MetricSchema,
	events: EventSchema,
	capabilities: CapabilitySchema
} as const;

describe('fixture JSON contracts', () => {
	it('includes at least 25 events', () => {
		expect(collections.events.seed.length).toBeGreaterThanOrEqual(25);
	});

	it('validates every seed record', () => {
		for (const name of COLLECTION_NAMES) {
			const raw = JSON.parse(readFileSync(join(fixtureDir, `${name}.json`), 'utf8'));
			expect(Array.isArray(raw)).toBe(true);
			for (const item of raw) {
				const result = v.safeParse(schemas[name], item);
				expect(result.success, `${name} item ${JSON.stringify(item)}`).toBe(true);
			}
		}
	});

	it('keeps cross-resource references valid', () => {
		const projectIds = new Set(collections.projects.seed.map((p) => p.id));
		const agentIds = new Set(collections.agents.seed.map((a) => a.id));

		for (const run of collections.runs.seed) {
			expect(projectIds.has(run.projectId)).toBe(true);
			expect(agentIds.has(run.agentId)).toBe(true);
		}
		for (const approval of collections.approvals.seed) {
			expect(projectIds.has(approval.projectId)).toBe(true);
		}
		for (const readiness of collections.readiness.seed) {
			expect(projectIds.has(readiness.projectId)).toBe(true);
		}
		for (const metric of collections.metrics.seed) {
			expect(agentIds.has(metric.agentId)).toBe(true);
		}
	});
});
