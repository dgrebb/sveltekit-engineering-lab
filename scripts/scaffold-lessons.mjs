#!/usr/bin/env node
/**
 * Generates Markdown lesson scaffolds and Example.svelte placeholders.
 * Does not overwrite the Basic Query reference lesson body if already customized.
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const lessons = [
	{
		id: '01-basic-query',
		title: 'Basic Query',
		description: 'Retrieve server-owned project data.',
		order: 1,
		difficulty: 'beginner',
		status: 'complete',
		duration: 15,
		primitives: ['query'],
		fixtures: ['projects'],
		topics: ['remote-functions', 'server-state'],
		objective: 'Return all projects from the fixture store via a remote query.',
		scenario: 'An operator opens the control plane and needs the current project list.',
		exercise: 'Implement a remote `query` that lists every project and render the results.',
		expected: 'The three seed projects (`p1`, `p2`, `p3`) with their statuses.',
		refs: [
			'[Remote functions — query](https://svelte.dev/docs/kit/remote-functions#query)',
			'[$app/server](https://svelte.dev/docs/kit/$app-server)'
		]
	},
	{
		id: '02-parameterized-query',
		title: 'Parameterized Query',
		description: 'Retrieve a single project by id.',
		order: 2,
		difficulty: 'beginner',
		status: 'planned',
		duration: 15,
		primitives: ['query'],
		fixtures: ['projects'],
		topics: ['remote-functions', 'validation'],
		objective: 'Retrieve project `p1` using a parameterized remote query.',
		scenario: 'An operator drills into one project from the fleet overview.',
		exercise: 'Accept a project id argument, validate it, and return that project.',
		expected: '{ "id": "p1", "name": "control-plane", "status": "healthy" }',
		refs: ['[Remote functions — query](https://svelte.dev/docs/kit/remote-functions#query)']
	},
	{
		id: '03-reactive-query',
		title: 'Reactive Query',
		description: 'Filter projects by a selected status.',
		order: 3,
		difficulty: 'beginner',
		status: 'planned',
		duration: 20,
		primitives: ['query'],
		fixtures: ['projects'],
		topics: ['remote-functions', 'reactivity'],
		objective: 'Filter projects by a UI-selected status using a reactive remote query.',
		scenario: 'An operator focuses the fleet list on degraded or offline projects.',
		exercise: 'Bind a status selector to a query argument and re-fetch when it changes.',
		expected: 'Only projects matching the selected status are shown.',
		refs: ['[Remote functions — query](https://svelte.dev/docs/kit/remote-functions#query)']
	},
	{
		id: '04-batched-query',
		title: 'Batched Query',
		description: 'Retrieve multiple agents by ID in one round trip.',
		order: 4,
		difficulty: 'intermediate',
		status: 'planned',
		duration: 20,
		primitives: ['query', 'query.batch'],
		fixtures: ['agents'],
		topics: ['remote-functions', 'batching'],
		objective: 'Retrieve multiple agents by ID using batched queries.',
		scenario: 'A dashboard resolves several agent cards without N+1 requests.',
		exercise: 'Use `query.batch` (if available) to fetch agents `a1` and `a2`.',
		expected: 'Both agents returned without duplicate round trips.',
		refs: ['[Remote functions — query.batch](https://svelte.dev/docs/kit/remote-functions)']
	},
	{
		id: '05-basic-form',
		title: 'Basic Form',
		description: 'Update a policy through a remote form.',
		order: 5,
		difficulty: 'beginner',
		status: 'planned',
		duration: 20,
		primitives: ['form'],
		fixtures: ['policies'],
		topics: ['remote-functions', 'forms'],
		objective: 'Update a policy using a remote form.',
		scenario: 'An operator toggles production approval requirements.',
		exercise: 'Build a form that PATCHes `policy1` fields via `form`.',
		expected: 'policy1 reflects the submitted values after save.',
		refs: ['[Remote functions — form](https://svelte.dev/docs/kit/remote-functions#form)']
	},
	{
		id: '06-form-validation',
		title: 'Form Validation',
		description: 'Reject invalid concurrency values on policies.',
		order: 6,
		difficulty: 'intermediate',
		status: 'planned',
		duration: 20,
		primitives: ['form'],
		fixtures: ['policies'],
		topics: ['validation', 'forms'],
		objective: 'Reject invalid concurrency values before mutating policy state.',
		scenario: 'An operator accidentally sets max concurrent runs to zero or a huge number.',
		exercise: 'Validate `maxConcurrentRuns` with a Standard Schema and surface field errors.',
		expected: 'Invalid values are rejected; valid values update policy1.',
		refs: ['[Remote functions — form](https://svelte.dev/docs/kit/remote-functions#form)']
	},
	{
		id: '07-basic-command',
		title: 'Basic Command',
		description: 'Toggle an agent enabled flag with a command.',
		order: 7,
		difficulty: 'beginner',
		status: 'planned',
		duration: 15,
		primitives: ['command'],
		fixtures: ['agents'],
		topics: ['remote-functions', 'mutations'],
		objective: 'Toggle an agent `enabled` flag with a remote command.',
		scenario: 'An operator disables the Security Scanner during an incident.',
		exercise: 'Implement a `command` that flips `enabled` for a given agent id.',
		expected: 'Agent a3.enabled becomes true (or false) after the command.',
		refs: ['[Remote functions — command](https://svelte.dev/docs/kit/remote-functions#command)']
	},
	{
		id: '08-query-refresh',
		title: 'Query Refresh',
		description: 'Refresh agent data after a mutation.',
		order: 8,
		difficulty: 'intermediate',
		status: 'planned',
		duration: 20,
		primitives: ['query', 'command'],
		fixtures: ['agents'],
		topics: ['cache', 'mutations'],
		objective: 'Refresh a query after mutating an agent.',
		scenario: 'After enabling an agent, the list should show the new state.',
		exercise: 'Call `.refresh()` (or equivalent) on the agents query after a command.',
		expected: 'UI shows updated agent state without a full page reload.',
		refs: ['[Remote functions — refreshing queries](https://svelte.dev/docs/kit/remote-functions)']
	},
	{
		id: '09-optimistic-updates',
		title: 'Optimistic Updates',
		description: 'Display and reconcile an optimistic agent mutation.',
		order: 9,
		difficulty: 'advanced',
		status: 'planned',
		duration: 25,
		primitives: ['query', 'command'],
		fixtures: ['agents'],
		topics: ['optimistic-ui'],
		objective: 'Display and reconcile an optimistic mutation on an agent.',
		scenario: 'The UI should feel instant when toggling agent enablement.',
		exercise: 'Apply an optimistic update, then reconcile with the server result.',
		expected: 'UI updates immediately, then matches server truth after settlement.',
		refs: ['[Remote functions — optimistic updates](https://svelte.dev/docs/kit/remote-functions)']
	},
	{
		id: '10-creating-resources',
		title: 'Creating Resources',
		description: 'Append a run record to the fixture store.',
		order: 10,
		difficulty: 'beginner',
		status: 'planned',
		duration: 15,
		primitives: ['command', 'form'],
		fixtures: ['runs'],
		topics: ['create', 'mutations'],
		objective: 'Append a run record to the runs collection.',
		scenario: 'An operator starts a new agent run against a project.',
		exercise: 'Create a run with agentId, projectId, status, and progress.',
		expected: 'A new run appears in the list with a generated id.',
		refs: ['[Remote functions — command](https://svelte.dev/docs/kit/remote-functions#command)']
	},
	{
		id: '11-live-queries',
		title: 'Live Queries',
		description: 'Observe changing run progress with a live query.',
		order: 11,
		difficulty: 'advanced',
		status: 'planned',
		duration: 25,
		primitives: ['query.live'],
		fixtures: ['runs'],
		topics: ['live-queries'],
		objective: 'Observe changing run progress with a live query.',
		scenario: 'A run progress bar should update as the server mutates progress.',
		exercise: 'Use `query.live` if available; otherwise document the limitation and leave pending.',
		expected: 'Progress for run r1 updates as the underlying fixture changes.',
		refs: ['[Remote functions — live queries](https://svelte.dev/docs/kit/remote-functions)']
	},
	{
		id: '12-concurrent-mutations',
		title: 'Concurrent Mutations',
		description: 'Resolve competing approval updates.',
		order: 12,
		difficulty: 'advanced',
		status: 'planned',
		duration: 25,
		primitives: ['command'],
		fixtures: ['approvals'],
		topics: ['concurrency'],
		objective: 'Resolve competing approval updates without corrupting state.',
		scenario: 'Two operators approve and reject the same request nearly simultaneously.',
		exercise: 'Issue overlapping updates to approval ap1 and observe final state.',
		expected: 'Last successful write wins; errors surface for conflicts if modeled.',
		refs: ['[Remote functions — command](https://svelte.dev/docs/kit/remote-functions#command)']
	},
	{
		id: '13-derived-server-state',
		title: 'Derived Server State',
		description: 'Evaluate whether all readiness checks passed.',
		order: 13,
		difficulty: 'intermediate',
		status: 'planned',
		duration: 20,
		primitives: ['query'],
		fixtures: ['readiness'],
		topics: ['derived-state'],
		objective: 'Evaluate whether all readiness checks passed on the server.',
		scenario: 'A release gate needs a single ready/not-ready signal.',
		exercise: 'Return a derived boolean from readiness checks for project p1.',
		expected: 'ready === false because Security failed.',
		refs: ['[Remote functions — query](https://svelte.dev/docs/kit/remote-functions#query)']
	},
	{
		id: '14-aggregated-queries',
		title: 'Aggregated Queries',
		description: 'Calculate total runs and failures across agents.',
		order: 14,
		difficulty: 'intermediate',
		status: 'planned',
		duration: 15,
		primitives: ['query'],
		fixtures: ['metrics'],
		topics: ['aggregation'],
		objective: 'Calculate total runs and failures from metrics.',
		scenario: 'An engineering lead wants fleet-wide agent throughput.',
		exercise: 'Sum `runs` and `failures` across all metric rows.',
		expected: '{ "runs": 44, "failures": 3 }',
		refs: ['[Remote functions — query](https://svelte.dev/docs/kit/remote-functions#query)']
	},
	{
		id: '15-pagination-and-filtering',
		title: 'Pagination and Filtering',
		description: 'Retrieve a subset of events.',
		order: 15,
		difficulty: 'intermediate',
		status: 'planned',
		duration: 20,
		primitives: ['query'],
		fixtures: ['events'],
		topics: ['pagination', 'filtering'],
		objective: 'Retrieve a subset of events with limit and offset.',
		scenario: 'An audit view pages through control-plane events.',
		exercise: 'Support limit/offset against the events collection.',
		expected: 'A slice of the 27 seed events matching the requested window.',
		refs: ['[Mock API](/docs/api-reference)']
	},
	{
		id: '16-prerendered-data',
		title: 'Prerendered Data',
		description: 'Publish a static capability catalog.',
		order: 16,
		difficulty: 'intermediate',
		status: 'planned',
		duration: 20,
		primitives: ['prerender'],
		fixtures: ['capabilities'],
		topics: ['prerender'],
		objective: 'Publish a static capability catalog with a prerender remote function.',
		scenario: 'Capability descriptions are stable and can ship in the HTML.',
		exercise: 'Use `prerender` to expose the capabilities fixture.',
		expected: 'Capabilities c1 and c2 available without a dynamic query round trip.',
		refs: ['[Remote functions — prerender](https://svelte.dev/docs/kit/remote-functions#prerender)']
	},
	{
		id: '17-upstream-api-integration',
		title: 'Upstream API Integration',
		description: 'Consume the mock REST API from a remote function.',
		order: 17,
		difficulty: 'intermediate',
		status: 'planned',
		duration: 20,
		primitives: ['query'],
		fixtures: ['projects'],
		topics: ['http', 'fetch'],
		objective: 'Consume the mock REST API from a remote function using request-scoped fetch.',
		scenario: 'Some lessons intentionally go through HTTP instead of the store API.',
		exercise: 'Call `GET /api/mock/projects` from a remote query.',
		expected: 'Same project list as the direct store path.',
		refs: [
			'[Mock API](/docs/api-reference)',
			'[Web standards](https://svelte.dev/docs/kit/web-standards)'
		]
	},
	{
		id: '18-error-handling',
		title: 'Error Handling',
		description: 'Handle invalid IDs and rejected mutations.',
		order: 18,
		difficulty: 'intermediate',
		status: 'planned',
		duration: 20,
		primitives: ['query', 'command'],
		fixtures: ['agents'],
		topics: ['errors'],
		objective: 'Handle invalid IDs and rejected mutations gracefully.',
		scenario: 'A stale UI requests agent a99 which does not exist.',
		exercise: 'Surface NOT_FOUND and VALIDATION_ERROR responses in the UI.',
		expected: 'Clear error messaging without crashing the page.',
		refs: [
			'[Errors](https://svelte.dev/docs/kit/errors)',
			'[svelte:boundary](https://svelte.dev/docs/svelte/svelte-boundary)'
		]
	},
	{
		id: '19-loading-and-async-boundaries',
		title: 'Loading and Async Boundaries',
		description: 'Explore pending and resolved query states.',
		order: 19,
		difficulty: 'intermediate',
		status: 'planned',
		duration: 20,
		primitives: ['query'],
		fixtures: ['projects'],
		topics: ['async', 'loading'],
		objective: 'Explore pending and resolved query states with async boundaries.',
		scenario: 'Slow queries should show pending UI instead of blank content.',
		exercise: 'Use `<svelte:boundary>` and/or query.loading while fetching projects.',
		expected: 'Pending and resolved states are both observable.',
		refs: [
			'[await expressions](https://svelte.dev/docs/svelte/await-expressions)',
			'[svelte:boundary](https://svelte.dev/docs/svelte/svelte-boundary)'
		]
	},
	{
		id: '20-combined-patterns',
		title: 'Combined Patterns',
		description: 'Compose previously learned remote-function primitives.',
		order: 20,
		difficulty: 'advanced',
		status: 'planned',
		duration: 30,
		primitives: ['query', 'command', 'form'],
		fixtures: ['projects', 'agents', 'runs', 'approvals'],
		topics: ['composition'],
		objective: 'Compose queries, commands, and forms into a small control-plane panel.',
		scenario: 'An operator reviews projects, starts a run, and resolves an approval.',
		exercise: 'Combine primitives from earlier lessons without new abstractions.',
		expected: 'A coherent mini-panel demonstrating multiple remote-function patterns.',
		refs: ['[Remote functions](https://svelte.dev/docs/kit/remote-functions)']
	}
];

const root = process.cwd();

function frontmatter(lesson) {
	return `---
title: ${lesson.title}
description: ${lesson.description}
section: Lessons
order: ${lesson.order}
difficulty: ${lesson.difficulty}
status: ${lesson.status}
duration: ${lesson.duration}
primitives:
${lesson.primitives.map((p) => `  - ${p}`).join('\n')}
fixtures:
${lesson.fixtures.map((f) => `  - ${f}`).join('\n')}
topics:
${lesson.topics.map((t) => `  - ${t}`).join('\n')}
---`;
}

function lessonMarkdown(lesson) {
	const fixtureImport =
		lesson.fixtures.length === 1
			? `import fixtureData from '#lib/mock/fixtures/${lesson.fixtures[0]}.json';`
			: lesson.fixtures
					.map((f) => `import ${f}Data from '#lib/mock/fixtures/${f}.json';`)
					.join('\n\t');

	const fixtureViewer =
		lesson.fixtures.length === 1
			? `<FixtureViewer name="${lesson.fixtures[0]}.json" data={fixtureData} />`
			: lesson.fixtures.map((f) => `<FixtureViewer name="${f}.json" data={${f}Data} />`).join('\n');

	const liveExample =
		lesson.id === '01-basic-query'
			? `<LiveExample source={exampleSource}>
	<Example />
</LiveExample>

<ResetFixtureButton collection="projects" />`
			: `<ExamplePlaceholder lesson="${lesson.title}" status="${lesson.status}" />`;

	const scriptImports =
		lesson.id === '01-basic-query'
			? `import { LiveExample } from 'svelte-docsmith';
	import LessonMetadata from '#lib/components/lab/LessonMetadata.svelte';
	import FixtureViewer from '#lib/components/lab/FixtureViewer.svelte';
	import ExpectedResult from '#lib/components/lab/ExpectedResult.svelte';
	import ResetFixtureButton from '#lib/components/lab/ResetFixtureButton.svelte';
	import Example from '#lib/examples/01-basic-query/Example.svelte';
	import exampleSource from '#lib/examples/01-basic-query/Example.svelte?source';
	${fixtureImport}
	const expected = fixtureData;`
			: `import LessonMetadata from '#lib/components/lab/LessonMetadata.svelte';
	import FixtureViewer from '#lib/components/lab/FixtureViewer.svelte';
	import ExpectedResult from '#lib/components/lab/ExpectedResult.svelte';
	import ExamplePlaceholder from '#lib/components/lab/ExamplePlaceholder.svelte';
	${fixtureImport}`;

	const expectedBlock =
		lesson.id === '01-basic-query'
			? `<ExpectedResult data={expected} />`
			: lesson.expected.startsWith('{') || lesson.expected.startsWith('[')
				? '```json\n' + lesson.expected + '\n```'
				: lesson.expected;

	return `${frontmatter(lesson)}

<script>
	${scriptImports}
</script>

<LessonMetadata
	difficulty="${lesson.difficulty}"
	status="${lesson.status}"
	duration={${lesson.duration}}
	primitives={${JSON.stringify(lesson.primitives)}}
	fixtures={${JSON.stringify(lesson.fixtures)}}
/>

## Objective

${lesson.objective}

## Scenario

${lesson.scenario}

## Provided Data

Fixture source: \`${lesson.fixtures.map((f) => `src/lib/mock/fixtures/${f}.json`).join('`, `')}\`.

${fixtureViewer}

## Expected Result

${expectedBlock}

## Exercise

${lesson.exercise}

Starter component: \`#lib/examples/${lesson.id}/Example.svelte\`.

## Live Example

${liveExample}

## Things to Investigate

- How the remote module is discovered (\`.remote.ts\` segment).
- Whether the exercise needs the fixture store directly or the mock HTTP API.
- How session isolation affects your mutations during experimentation.

## Observations

_Fill in during your exploration._

## Production Considerations

Ephemeral in-memory fixtures are for learning only. Production systems need durable storage, authorization, and observability.

## References

${lesson.refs.map((r) => `- ${r}`).join('\n')}
`;
}

function exampleComponent(lesson) {
	return `<script lang="ts">
	/**
	 * Scaffold for ${lesson.title}.
	 * Implement the remote function(s) in example.remote.ts when you begin this lesson.
	 */
	const lesson = '${lesson.title}';
</script>

<div class="scaffold">
	<p><strong>{lesson}</strong> — exercise not implemented yet.</p>
	<p class="hint">Create <code>example.remote.ts</code> beside this file when you start.</p>
</div>

<style>
	.scaffold {
		padding: 0.75rem 0;
		color: var(--muted-foreground);
		font-size: 0.9rem;
	}

	.hint {
		margin: 0.35rem 0 0;
		font-size: 0.8rem;
	}

	code {
		font-size: 0.85em;
	}
</style>
`;
}

for (const lesson of lessons) {
	const docsDir = join(root, 'src/routes/docs/lessons', lesson.id);
	const exampleDir = join(root, 'src/lib/examples', lesson.id);
	mkdirSync(docsDir, { recursive: true });
	mkdirSync(exampleDir, { recursive: true });

	const pagePath = join(docsDir, '+page.md');
	writeFileSync(pagePath, lessonMarkdown(lesson));

	const examplePath = join(exampleDir, 'Example.svelte');
	if (lesson.id === '01-basic-query') {
		// Reference implementation is maintained separately.
		if (!existsSync(examplePath)) {
			console.warn('Missing Basic Query Example.svelte');
		}
	} else {
		writeFileSync(examplePath, exampleComponent(lesson));
	}
}

console.log(`Scaffolded ${lessons.length} lessons.`);
