---
title: Query Refresh
description: Refresh agent data after a mutation.
section: Lessons
order: 8
difficulty: intermediate
status: planned
duration: 20
primitives:
  - query
  - command
fixtures:
  - agents
topics:
  - cache
  - mutations
---

<script>
	import LessonMetadata from '#lib/components/lab/LessonMetadata.svelte';
	import FixtureViewer from '#lib/components/lab/FixtureViewer.svelte';
	import ExpectedResult from '#lib/components/lab/ExpectedResult.svelte';
	import ExamplePlaceholder from '#lib/components/lab/ExamplePlaceholder.svelte';
	import fixtureData from '#lib/mock/fixtures/agents.json';
</script>

<LessonMetadata
	difficulty="intermediate"
	status="planned"
	duration={20}
	primitives={["query","command"]}
	fixtures={["agents"]}
/>

## Objective

Refresh a query after mutating an agent.

## Scenario

After enabling an agent, the list should show the new state.

## Provided Data

Fixture source: `src/lib/mock/fixtures/agents.json`.

<FixtureViewer name="agents.json" data={fixtureData} />

## Expected Result

UI shows updated agent state without a full page reload.

## Exercise

Call `.refresh()` (or equivalent) on the agents query after a command.

Starter component: `#lib/examples/08-query-refresh/Example.svelte`.

## Live Example

<ExamplePlaceholder lesson="Query Refresh" status="planned" />

## Things to Investigate

- How the remote module is discovered (`.remote.ts` segment).
- Whether the exercise needs the fixture store directly or the mock HTTP API.
- How session isolation affects your mutations during experimentation.

## Observations

_Fill in during your exploration._

## Production Considerations

Ephemeral in-memory fixtures are for learning only. Production systems need durable storage, authorization, and observability.

## References

- [Remote functions — refreshing queries](https://svelte.dev/docs/kit/remote-functions)
