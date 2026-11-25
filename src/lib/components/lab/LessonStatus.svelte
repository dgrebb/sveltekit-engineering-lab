<script lang="ts">
	type Status = 'planned' | 'exploring' | 'complete';

	const { status }: { status: Status } = $props();

	const label = $derived(
		status === 'complete' ? 'Complete' : status === 'exploring' ? 'Exploring' : 'Planned'
	);
</script>

<span class="lesson-status" data-status={status}>{label}</span>

<style>
	.lesson-status {
		display: inline-block;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding: 0.15rem 0.5rem;
		border-radius: 0.25rem;
		border: 1px solid var(--border);
		color: var(--muted-foreground);
		background: var(--muted);
	}

	.lesson-status[data-status='complete'] {
		color: var(--primary);
		border-color: color-mix(in oklch, var(--primary) 40%, var(--border));
	}

	.lesson-status[data-status='exploring'] {
		color: var(--foreground);
	}
</style>
