import * as v from 'valibot';
import {
	AgentInputSchema,
	AgentSchema,
	ApprovalInputSchema,
	ApprovalSchema,
	CapabilityInputSchema,
	CapabilitySchema,
	EventInputSchema,
	EventSchema,
	MetricInputSchema,
	MetricSchema,
	PolicyInputSchema,
	PolicySchema,
	ProjectInputSchema,
	ProjectSchema,
	ReadinessInputSchema,
	ReadinessSchema,
	RunInputSchema,
	RunSchema,
	type Agent,
	type Approval,
	type Capability,
	type Event,
	type Metric,
	type Policy,
	type Project,
	type Readiness,
	type Run
} from '../../schemas/entities.ts';
import agentsSeed from '../../mock/fixtures/agents.json';
import approvalsSeed from '../../mock/fixtures/approvals.json';
import capabilitiesSeed from '../../mock/fixtures/capabilities.json';
import eventsSeed from '../../mock/fixtures/events.json';
import metricsSeed from '../../mock/fixtures/metrics.json';
import policiesSeed from '../../mock/fixtures/policies.json';
import projectsSeed from '../../mock/fixtures/projects.json';
import readinessSeed from '../../mock/fixtures/readiness.json';
import runsSeed from '../../mock/fixtures/runs.json';

export const COLLECTION_NAMES = [
	'projects',
	'agents',
	'policies',
	'runs',
	'approvals',
	'readiness',
	'metrics',
	'events',
	'capabilities'
] as const;

export type CollectionName = (typeof COLLECTION_NAMES)[number];

export type CollectionEntityMap = {
	projects: Project;
	agents: Agent;
	policies: Policy;
	runs: Run;
	approvals: Approval;
	readiness: Readiness;
	metrics: Metric;
	events: Event;
	capabilities: Capability;
};

export type FilterField = 'status' | 'projectId' | 'agentId';

type CollectionConfig<TName extends CollectionName> = {
	schema: v.GenericSchema;
	inputSchema: v.GenericSchema;
	seed: readonly CollectionEntityMap[TName][];
	filterFields: readonly FilterField[];
	idPrefix: string;
};

export const collections = {
	projects: {
		schema: ProjectSchema,
		inputSchema: ProjectInputSchema,
		seed: projectsSeed as Project[],
		filterFields: ['status'] as const,
		idPrefix: 'p'
	},
	agents: {
		schema: AgentSchema,
		inputSchema: AgentInputSchema,
		seed: agentsSeed as Agent[],
		filterFields: ['status'] as const,
		idPrefix: 'a'
	},
	policies: {
		schema: PolicySchema,
		inputSchema: PolicyInputSchema,
		seed: policiesSeed as Policy[],
		filterFields: [] as const,
		idPrefix: 'policy'
	},
	runs: {
		schema: RunSchema,
		inputSchema: RunInputSchema,
		seed: runsSeed as Run[],
		filterFields: ['status', 'projectId', 'agentId'] as const,
		idPrefix: 'r'
	},
	approvals: {
		schema: ApprovalSchema,
		inputSchema: ApprovalInputSchema,
		seed: approvalsSeed as Approval[],
		filterFields: ['status', 'projectId'] as const,
		idPrefix: 'ap'
	},
	readiness: {
		schema: ReadinessSchema,
		inputSchema: ReadinessInputSchema,
		seed: readinessSeed as Readiness[],
		filterFields: ['projectId'] as const,
		idPrefix: 'readiness'
	},
	metrics: {
		schema: MetricSchema,
		inputSchema: MetricInputSchema,
		seed: metricsSeed as Metric[],
		filterFields: ['agentId'] as const,
		idPrefix: 'm'
	},
	events: {
		schema: EventSchema,
		inputSchema: EventInputSchema,
		seed: eventsSeed as Event[],
		filterFields: [] as const,
		idPrefix: 'e'
	},
	capabilities: {
		schema: CapabilitySchema,
		inputSchema: CapabilityInputSchema,
		seed: capabilitiesSeed as Capability[],
		filterFields: [] as const,
		idPrefix: 'c'
	}
} satisfies { [K in CollectionName]: CollectionConfig<K> };

export function isCollectionName(value: string): value is CollectionName {
	return (COLLECTION_NAMES as readonly string[]).includes(value);
}

export function getSeedCopy<TName extends CollectionName>(
	name: TName
): CollectionEntityMap[TName][] {
	return structuredClone(collections[name].seed) as CollectionEntityMap[TName][];
}

export function getAllSeeds(): { [K in CollectionName]: CollectionEntityMap[K][] } {
	return {
		projects: getSeedCopy('projects'),
		agents: getSeedCopy('agents'),
		policies: getSeedCopy('policies'),
		runs: getSeedCopy('runs'),
		approvals: getSeedCopy('approvals'),
		readiness: getSeedCopy('readiness'),
		metrics: getSeedCopy('metrics'),
		events: getSeedCopy('events'),
		capabilities: getSeedCopy('capabilities')
	};
}
