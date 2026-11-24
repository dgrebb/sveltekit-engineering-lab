---
title: Basic Command
description: Toggle an agent enabled flag with a command.
section: Lessons
order: 7
difficulty: beginner
status: planned
duration: 15
primitives:
  - command
fixtures:
  - agents
topics:
  - remote-functions
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
	difficulty="beginner"
	status="planned"
	duration={15}
	primitives={["command"]}
	fixtures={["agents"]}
/>

## Objective

Toggle an agent `enabled` flag with a remote command.

## Scenario

An operator disables the Security Scanner during an incident.

## Provided Data

Fixture source: `src/lib/mock/fixtures/agents.json`.

<FixtureViewer name="agents.json" data={fixtureData} />

## Expected Result

Agent a3.enabled becomes true (or false) after the command.

## Exercise

Implement a `command` that flips `enabled` for a given agent id.

Starter component: `#lib/examples/07-basic-command/Example.svelte`.

## Live Example

<ExamplePlaceholder lesson="Basic Command" status="planned" />

## Things to Investigate

- How the remote module is discovered (`.remote.ts` segment).
- Whether the exercise needs the fixture store directly or the mock HTTP API.
- How session isolation affects your mutations during experimentation.

## Observations

_Fill in during your exploration._

## Production Considerations

Ephemeral in-memory fixtures are for learning only. Production systems need durable storage, authorization, and observability.

## References

- [Remote functions — command](https://svelte.dev/docs/kit/remote-functions#command)
