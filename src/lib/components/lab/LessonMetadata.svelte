<script lang="ts">
	import LessonStatus from './LessonStatus.svelte';

	type Status = 'planned' | 'exploring' | 'complete';
	type Difficulty = 'beginner' | 'intermediate' | 'advanced';

	const {
		difficulty,
		status,
		duration,
		primitives = [],
		fixtures = []
	}: {
		difficulty?: Difficulty;
		status?: Status;
		duration?: number;
		primitives?: string[];
		fixtures?: string[];
	} = $props();
</script>

<dl class="lesson-meta">
	{#if status}
		<div>
			<dt>Status</dt>
			<dd><LessonStatus {status} /></dd>
		</div>
	{/if}
	{#if difficulty}
		<div>
			<dt>Difficulty</dt>
			<dd>{difficulty}</dd>
		</div>
	{/if}
	{#if duration !== undefined}
		<div>
			<dt>Duration</dt>
			<dd>~{duration} min</dd>
		</div>
	{/if}
	{#if primitives.length}
		<div>
			<dt>Primitives</dt>
			<dd>{primitives.join(', ')}</dd>
		</div>
	{/if}
	{#if fixtures.length}
		<div>
			<dt>Fixtures</dt>
			<dd>{fixtures.join(', ')}</dd>
		</div>
	{/if}
</dl>

<style>
	.lesson-meta {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
		gap: 0.75rem 1.25rem;
		margin: 0 0 1.5rem;
		padding: 0.85rem 1rem;
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		background: var(--muted);
		font-size: 0.875rem;
	}

	.lesson-meta div {
		margin: 0;
	}

	.lesson-meta dt {
		margin: 0 0 0.2rem;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--muted-foreground);
	}

	.lesson-meta dd {
		margin: 0;
		color: var(--foreground);
	}
</style>
