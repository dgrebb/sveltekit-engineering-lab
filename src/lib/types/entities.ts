export type {
	Project,
	Agent,
	Policy,
	Run,
	Approval,
	Readiness,
	Metric,
	Event,
	Capability
} from '../schemas/entities.ts';

export type Entity =
	| import('../schemas/entities.ts').Project
	| import('../schemas/entities.ts').Agent
	| import('../schemas/entities.ts').Policy
	| import('../schemas/entities.ts').Run
	| import('../schemas/entities.ts').Approval
	| import('../schemas/entities.ts').Readiness
	| import('../schemas/entities.ts').Metric
	| import('../schemas/entities.ts').Event
	| import('../schemas/entities.ts').Capability;

export type ApiErrorBody = {
	code: string;
	message: string;
};
