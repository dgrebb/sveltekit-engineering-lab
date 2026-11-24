import * as v from 'valibot';

export const ProjectStatusSchema = v.picklist(['healthy', 'degraded', 'offline']);
export const AgentStatusSchema = v.picklist(['idle', 'running', 'error']);
export const RunStatusSchema = v.picklist(['pending', 'running', 'completed', 'failed']);
export const ApprovalStatusSchema = v.picklist(['pending', 'approved', 'rejected']);

export const ProjectSchema = v.object({
	id: v.string(),
	name: v.string(),
	status: ProjectStatusSchema
});

export const AgentSchema = v.object({
	id: v.string(),
	name: v.string(),
	status: AgentStatusSchema,
	enabled: v.boolean()
});

export const PolicySchema = v.object({
	id: v.string(),
	requireApproval: v.boolean(),
	allowProduction: v.boolean(),
	maxConcurrentRuns: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(100))
});

export const RunSchema = v.object({
	id: v.string(),
	agentId: v.string(),
	projectId: v.string(),
	status: RunStatusSchema,
	progress: v.pipe(v.number(), v.minValue(0), v.maxValue(100))
});

export const ApprovalSchema = v.object({
	id: v.string(),
	action: v.string(),
	projectId: v.string(),
	status: ApprovalStatusSchema
});

export const ReadinessCheckSchema = v.object({
	name: v.string(),
	passed: v.boolean()
});

export const ReadinessSchema = v.object({
	id: v.string(),
	projectId: v.string(),
	checks: v.array(ReadinessCheckSchema)
});

export const MetricSchema = v.object({
	id: v.string(),
	agentId: v.string(),
	runs: v.pipe(v.number(), v.integer(), v.minValue(0)),
	failures: v.pipe(v.number(), v.integer(), v.minValue(0))
});

export const EventSchema = v.object({
	id: v.string(),
	type: v.string(),
	actor: v.string(),
	timestamp: v.string()
});

export const CapabilitySchema = v.object({
	id: v.string(),
	name: v.string(),
	description: v.string()
});

/** Partial schemas for create/update payloads (id optional on create). */
export const ProjectInputSchema = v.object({
	id: v.optional(v.string()),
	name: v.string(),
	status: ProjectStatusSchema
});

export const AgentInputSchema = v.object({
	id: v.optional(v.string()),
	name: v.string(),
	status: AgentStatusSchema,
	enabled: v.boolean()
});

export const PolicyInputSchema = v.object({
	id: v.optional(v.string()),
	requireApproval: v.boolean(),
	allowProduction: v.boolean(),
	maxConcurrentRuns: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(100))
});

export const RunInputSchema = v.object({
	id: v.optional(v.string()),
	agentId: v.string(),
	projectId: v.string(),
	status: RunStatusSchema,
	progress: v.pipe(v.number(), v.minValue(0), v.maxValue(100))
});

export const ApprovalInputSchema = v.object({
	id: v.optional(v.string()),
	action: v.string(),
	projectId: v.string(),
	status: ApprovalStatusSchema
});

export const ReadinessInputSchema = v.object({
	id: v.optional(v.string()),
	projectId: v.string(),
	checks: v.array(ReadinessCheckSchema)
});

export const MetricInputSchema = v.object({
	id: v.optional(v.string()),
	agentId: v.string(),
	runs: v.pipe(v.number(), v.integer(), v.minValue(0)),
	failures: v.pipe(v.number(), v.integer(), v.minValue(0))
});

export const EventInputSchema = v.object({
	id: v.optional(v.string()),
	type: v.string(),
	actor: v.string(),
	timestamp: v.string()
});

export const CapabilityInputSchema = v.object({
	id: v.optional(v.string()),
	name: v.string(),
	description: v.string()
});

export type Project = v.InferOutput<typeof ProjectSchema>;
export type Agent = v.InferOutput<typeof AgentSchema>;
export type Policy = v.InferOutput<typeof PolicySchema>;
export type Run = v.InferOutput<typeof RunSchema>;
export type Approval = v.InferOutput<typeof ApprovalSchema>;
export type Readiness = v.InferOutput<typeof ReadinessSchema>;
export type Metric = v.InferOutput<typeof MetricSchema>;
export type Event = v.InferOutput<typeof EventSchema>;
export type Capability = v.InferOutput<typeof CapabilitySchema>;
