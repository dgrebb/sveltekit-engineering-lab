<script lang="ts">
	const {
		collection
	}: {
		collection?: string;
	} = $props();

	let busy = $state(false);
	let message = $state<string | null>(null);

	async function reset() {
		busy = true;
		message = null;
		try {
			const body = collection ? JSON.stringify({ collection }) : undefined;
			const response = await fetch('/api/mock/reset', {
				method: 'POST',
				headers: body ? { 'content-type': 'application/json' } : undefined,
				body
			});
			if (!response.ok) {
				const error = (await response.json()) as { message?: string };
				message = error.message ?? `Reset failed (${response.status})`;
				return;
			}
			const result = (await response.json()) as { reset: string };
			message = result.reset === 'all' ? 'All fixtures restored.' : `Reset ${result.reset}.`;
		} catch (error) {
			message = error instanceof Error ? error.message : 'Reset failed.';
		} finally {
			busy = false;
		}
	}
</script>

<div class="reset-fixture">
	<button type="button" onclick={reset} disabled={busy}>
		{busy ? 'Resetting…' : collection ? `Reset ${collection}` : 'Reset all fixtures'}
	</button>
	{#if message}
		<p class="message">{message}</p>
	{/if}
</div>

<style>
	.reset-fixture {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
		margin: 1rem 0;
	}

	button {
		appearance: none;
		border: 1px solid var(--border);
		background: var(--secondary);
		color: var(--secondary-foreground);
		border-radius: 0.375rem;
		padding: 0.4rem 0.85rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	button:hover:not(:disabled) {
		background: var(--accent);
		color: var(--accent-foreground);
	}

	.message {
		margin: 0;
		font-size: 0.85rem;
		color: var(--muted-foreground);
	}
</style>
