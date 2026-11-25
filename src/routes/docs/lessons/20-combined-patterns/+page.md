---
title: Combined Patterns
description: Compose previously learned remote-function primitives.
section: Lessons
order: 20
difficulty: advanced
status: planned
duration: 30
primitives:
  - query
  - command
  - form
fixtures:
  - projects
  - agents
  - runs
  - approvals
topics:
  - composition
---

<script>
	import LessonMetadata from '#lib/components/lab/LessonMetadata.svelte';
	import FixtureViewer from '#lib/components/lab/FixtureViewer.svelte';
	import ExpectedResult from '#lib/components/lab/ExpectedResult.svelte';
	import ExamplePlaceholder from '#lib/components/lab/ExamplePlaceholder.svelte';
	import projectsData from '#lib/mock/fixtures/projects.json';
	import agentsData from '#lib/mock/fixtures/agents.json';
	import runsData from '#lib/mock/fixtures/runs.json';
	import approvalsData from '#lib/mock/fixtures/approvals.json';
</script>

<LessonMetadata
	difficulty="advanced"
	status="planned"
	duration={30}
	primitives={["query","command","form"]}
	fixtures={["projects","agents","runs","approvals"]}
/>

## Objective

Compose queries, commands, and forms into a small operator panel.

## Scenario

An operator reviews projects, starts a run, and resolves an approval.

## Provided Data

Fixture source: `src/lib/mock/fixtures/projects.json`, `src/lib/mock/fixtures/agents.json`, `src/lib/mock/fixtures/runs.json`, `src/lib/mock/fixtures/approvals.json`.

<FixtureViewer name="projects.json" data={projectsData} />
<FixtureViewer name="agents.json" data={agentsData} />
<FixtureViewer name="runs.json" data={runsData} />
<FixtureViewer name="approvals.json" data={approvalsData} />

## Expected Result

A coherent mini-panel demonstrating multiple remote-function patterns.

## Exercise

Combine primitives from earlier lessons without new abstractions.

Starter component: `#lib/examples/20-combined-patterns/Example.svelte`.

## Live Example

<ExamplePlaceholder lesson="Combined Patterns" status="planned" />

## Things to Investigate

- How the remote module is discovered (`.remote.ts` segment).
- Whether the exercise needs the fixture store directly or the mock HTTP API.
- How session isolation affects your mutations during experimentation.

## Observations

_Fill in during your exploration._

## Production Considerations

Ephemeral in-memory fixtures are for learning only. Production systems need durable storage, authorization, and observability.

## References

- [Remote functions](https://svelte.dev/docs/kit/remote-functions)
