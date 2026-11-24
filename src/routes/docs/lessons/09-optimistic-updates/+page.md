---
title: Optimistic Updates
description: Display and reconcile an optimistic agent mutation.
section: Lessons
order: 9
difficulty: advanced
status: planned
duration: 25
primitives:
  - query
  - command
fixtures:
  - agents
topics:
  - optimistic-ui
---

<script>
	import LessonMetadata from '#lib/components/lab/LessonMetadata.svelte';
	import FixtureViewer from '#lib/components/lab/FixtureViewer.svelte';
	import ExpectedResult from '#lib/components/lab/ExpectedResult.svelte';
	import ExamplePlaceholder from '#lib/components/lab/ExamplePlaceholder.svelte';
	import fixtureData from '#lib/mock/fixtures/agents.json';
</script>

<LessonMetadata
	difficulty="advanced"
	status="planned"
	duration={25}
	primitives={["query","command"]}
	fixtures={["agents"]}
/>

## Objective

Display and reconcile an optimistic mutation on an agent.

## Scenario

The UI should feel instant when toggling agent enablement.

## Provided Data

Fixture source: `src/lib/mock/fixtures/agents.json`.

<FixtureViewer name="agents.json" data={fixtureData} />

## Expected Result

UI updates immediately, then matches server truth after settlement.

## Exercise

Apply an optimistic update, then reconcile with the server result.

Starter component: `#lib/examples/09-optimistic-updates/Example.svelte`.

## Live Example

<ExamplePlaceholder lesson="Optimistic Updates" status="planned" />

## Things to Investigate

- How the remote module is discovered (`.remote.ts` segment).
- Whether the exercise needs the fixture store directly or the mock HTTP API.
- How session isolation affects your mutations during experimentation.

## Observations

_Fill in during your exploration._

## Production Considerations

Ephemeral in-memory fixtures are for learning only. Production systems need durable storage, authorization, and observability.

## References

- [Remote functions — optimistic updates](https://svelte.dev/docs/kit/remote-functions)
