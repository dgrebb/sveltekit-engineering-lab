---
title: Fixture Reference
description: Seed data for every mock collection.
section: Reference
order: 2
---

<script>
	import FixtureViewer from '#lib/components/lab/FixtureViewer.svelte';
	import ResetFixtureButton from '#lib/components/lab/ResetFixtureButton.svelte';
	import projects from '#lib/mock/fixtures/projects.json';
	import agents from '#lib/mock/fixtures/agents.json';
	import policies from '#lib/mock/fixtures/policies.json';
	import runs from '#lib/mock/fixtures/runs.json';
	import approvals from '#lib/mock/fixtures/approvals.json';
	import readiness from '#lib/mock/fixtures/readiness.json';
	import metrics from '#lib/mock/fixtures/metrics.json';
	import events from '#lib/mock/fixtures/events.json';
	import capabilities from '#lib/mock/fixtures/capabilities.json';
</script>

JSON fixtures under `src/lib/mock/fixtures/` are the immutable seed source. The server store
copies them into per-session mutable state.

<ResetFixtureButton />

## projects

<FixtureViewer name="projects.json" data={projects} />

## agents

<FixtureViewer name="agents.json" data={agents} />

## policies

<FixtureViewer name="policies.json" data={policies} />

## runs

Cross-references: `agentId` → agents, `projectId` → projects.

<FixtureViewer name="runs.json" data={runs} />

## approvals

<FixtureViewer name="approvals.json" data={approvals} />

## readiness

<FixtureViewer name="readiness.json" data={readiness} />

## metrics

<FixtureViewer name="metrics.json" data={metrics} />

## events

Twenty-seven predictable records for pagination and filtering exercises.

<FixtureViewer name="events.json" data={events} />

## capabilities

<FixtureViewer name="capabilities.json" data={capabilities} />
