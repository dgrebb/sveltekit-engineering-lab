<script module lang="ts">
	type Mermaid = (typeof import('mermaid'))['default'];

	let loaded: Promise<Mermaid> | undefined;
	const loadMermaid = () => (loaded ??= import('mermaid').then((m) => m.default));

	// Serialize initialize+render so concurrent diagrams can't race on theme.
	let chain: Promise<unknown> = Promise.resolve();

	function serialize<T>(job: () => Promise<T>): Promise<T> {
		const result = chain.then(job, job);
		chain = result.catch(() => {});
		return result;
	}
</script>

<script lang="ts">
	import { onMount, tick } from 'svelte';

	const { code }: { code: string } = $props();

	const uid = $props.id();
	let renders = 0;

	let svg = $state('');
	let failed = $state(false);
	let lastDark: boolean | undefined;

	let scale = $state(1);
	let panX = $state(0);
	let panY = $state(0);
	let fullscreen = $state(false);
	let userAdjusted = $state(false);

	let viewerEl: HTMLElement | undefined = $state();
	let viewportEl: HTMLElement | undefined = $state();
	let canvasEl: HTMLElement | undefined = $state();
	let dragging = false;
	let dragOriginX = 0;
	let dragOriginY = 0;
	let panOriginX = 0;
	let panOriginY = 0;
	let fitToken = 0;

	let colorCanvas: CanvasRenderingContext2D | null | undefined;

	const SENTINEL = '#010203';
	const MIN_SCALE = 0.5;
	const MAX_SCALE = 4;
	const ZOOM_STEP = 1.25;
	const FIT_PAD = 0.92;

	const transform = $derived(
		`translate(${panX}px, ${panY}px) scale(${scale})`
	);

	/** Natural CSS-pixel size of the mermaid diagram only (never toolbar icons). */
	function measureDiagram(svgEl: SVGSVGElement, currentScale: number): { w: number; h: number } | null {
		try {
			const bbox = svgEl.getBBox();
			if (bbox.width > 0 && bbox.height > 0) {
				const ctm = svgEl.getScreenCTM();
				if (ctm) {
					// Undo canvas zoom so we get the un-zoomed graphics size in CSS px.
					const sx = Math.hypot(ctm.a, ctm.b) / currentScale;
					const sy = Math.hypot(ctm.c, ctm.d) / currentScale;
					const w = bbox.width * sx;
					const h = bbox.height * sy;
					if (w > 0 && h > 0) return { w, h };
				}
				// Mermaid user units are typically CSS pixels when CTM is unavailable.
				return { w: bbox.width, h: bbox.height };
			}
		} catch {
			// getBBox throws if the SVG isn't rendered yet.
		}

		const rect = svgEl.getBoundingClientRect();
		const w = rect.width / currentScale;
		const h = rect.height / currentScale;
		if (w <= 0 || h <= 0) return null;
		return { w, h };
	}

	function autoFit() {
		if (userAdjusted || !viewportEl || !canvasEl) return;
		// Only the diagram root inside `.canvas` — never toolbar icon SVGs.
		const svgEl = canvasEl.querySelector(':scope > svg');
		if (!(svgEl instanceof SVGSVGElement)) return;

		const vw = viewportEl.clientWidth;
		if (vw <= 0) return;

		const size = measureDiagram(svgEl, scale);
		if (!size || size.w <= 0) return;

		// Width-first: fill ~92% of viewport width; height can scroll.
		const fit = (vw * FIT_PAD) / size.w;
		scale = Math.min(MAX_SCALE, Math.max(1, fit));
		panX = 0;
		panY = 0;
		viewportEl.scrollTop = 0;
	}

	async function scheduleAutoFit() {
		const token = ++fitToken;
		await tick();
		await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
		if (token !== fitToken) return;
		autoFit();
	}

	function resolveColor(value: string): string | null {
		colorCanvas ??= document.createElement('canvas').getContext('2d', {
			willReadFrequently: true
		});
		const ctx = colorCanvas;
		const input = value.trim();
		if (!ctx || !input) return null;
		ctx.fillStyle = SENTINEL;
		ctx.fillStyle = input;
		if (ctx.fillStyle === SENTINEL && input.toLowerCase() !== SENTINEL) return null;
		ctx.clearRect(0, 0, 1, 1);
		ctx.fillRect(0, 0, 1, 1);
		const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
		return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
	}

	function luminance(hex: string): number {
		const r = parseInt(hex.slice(1, 3), 16) / 255;
		const g = parseInt(hex.slice(3, 5), 16) / 255;
		const b = parseInt(hex.slice(5, 7), 16) / 255;
		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	}

	function themeVariables(dark: boolean): Record<string, string | boolean> | null {
		const root = getComputedStyle(document.documentElement);
		const background = resolveColor(root.getPropertyValue('--background'));
		const foreground = resolveColor(root.getPropertyValue('--foreground'));
		const muted = resolveColor(root.getPropertyValue('--muted'));
		const mutedForeground = resolveColor(root.getPropertyValue('--muted-foreground'));
		const border = resolveColor(root.getPropertyValue('--border'));
		const accent = resolveColor(root.getPropertyValue('--accent'));
		const card = resolveColor(root.getPropertyValue('--card'));
		if (!background || !foreground || !muted || !mutedForeground || !border || !accent || !card) {
			return null;
		}

		// Prefer the fill that contrasts more with the page background so nodes
		// stay readable in dark mode when muted sits too close to background.
		const mutedDist = Math.abs(luminance(muted) - luminance(background));
		const cardDist = Math.abs(luminance(card) - luminance(background));
		const primaryColor = cardDist >= mutedDist ? card : muted;
		const tertiaryColor = primaryColor === card ? muted : card;

		return {
			darkMode: dark,
			background,
			primaryColor,
			primaryTextColor: foreground,
			primaryBorderColor: border,
			lineColor: mutedForeground,
			secondaryColor: accent,
			tertiaryColor
		};
	}

	async function render() {
		let mermaid: Mermaid;
		try {
			mermaid = await loadMermaid();
		} catch {
			failed = true;
			return;
		}

		const dark = document.documentElement.classList.contains('dark');
		lastDark = dark;
		const vars = themeVariables(dark);
		const attempts = [
			vars && { theme: 'base' as const, themeVariables: vars },
			{ theme: dark ? ('dark' as const) : ('default' as const) }
		];

		for (const attempt of attempts) {
			if (!attempt) continue;
			try {
				const result = await serialize(() => {
					mermaid.initialize({
						startOnLoad: false,
						securityLevel: 'strict',
						fontFamily: 'inherit',
						fontSize: 16,
						flowchart: {
							htmlLabels: true,
							padding: 12,
							nodeSpacing: 40,
							rankSpacing: 50
						},
						...attempt
					});
					return mermaid.render(`${uid}-${(renders += 1)}`, code);
				});
				svg = result.svg;
				failed = false;
				if (!userAdjusted) scheduleAutoFit();
				return;
			} catch {
				// Try the next (safer) config.
			}
		}
		failed = true;
	}

	function zoomIn() {
		userAdjusted = true;
		scale = Math.min(MAX_SCALE, scale * ZOOM_STEP);
	}

	function zoomOut() {
		userAdjusted = true;
		scale = Math.max(MIN_SCALE, scale / ZOOM_STEP);
	}

	function resetView() {
		userAdjusted = false;
		scale = 1;
		panX = 0;
		panY = 0;
		scheduleAutoFit();
	}

	async function toggleFullscreen() {
		if (!viewerEl) return;
		try {
			if (document.fullscreenElement === viewerEl) {
				await document.exitFullscreen();
			} else {
				await viewerEl.requestFullscreen();
			}
		} catch {
			// Fullscreen may be blocked by the browser.
		}
	}

	function onFullscreenChange() {
		const entering = document.fullscreenElement === viewerEl;
		fullscreen = entering;
		if (entering && !userAdjusted) scheduleAutoFit();
	}

	function onPointerDown(event: PointerEvent) {
		if (event.button !== 0) return;
		dragging = true;
		dragOriginX = event.clientX;
		dragOriginY = event.clientY;
		panOriginX = panX;
		panOriginY = panY;
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}

	function onPointerMove(event: PointerEvent) {
		if (!dragging) return;
		const nextX = panOriginX + (event.clientX - dragOriginX);
		const nextY = panOriginY + (event.clientY - dragOriginY);
		if (nextX !== panX || nextY !== panY) userAdjusted = true;
		panX = nextX;
		panY = nextY;
	}

	function onPointerUp(event: PointerEvent) {
		if (!dragging) return;
		dragging = false;
		try {
			(event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
		} catch {
			// Capture may already be released.
		}
	}

	onMount(() => {
		render();
		const observer = new MutationObserver(() => {
			if (document.documentElement.classList.contains('dark') !== lastDark) render();
		});
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class']
		});
		document.addEventListener('fullscreenchange', onFullscreenChange);
		return () => {
			observer.disconnect();
			document.removeEventListener('fullscreenchange', onFullscreenChange);
		};
	});
</script>

{#if failed}
	<pre class="docsmith-mermaid-fallback not-prose"><code>{code}</code></pre>
{:else if svg}
	<figure
		class={['docsmith-mermaid not-prose', { 'is-fullscreen': fullscreen }]}
		{@attach (node) => {
			viewerEl = node;
			return () => {
				viewerEl = undefined;
			};
		}}
	>
		<div class="toolbar" role="toolbar" aria-label="Diagram controls">
			<button type="button" class="tool" onclick={zoomIn} aria-label="Zoom in">
				<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
					<path fill="currentColor" d="M7 2h2v5h5v2H9v5H7V9H2V7h5V2z" />
				</svg>
			</button>
			<button type="button" class="tool" onclick={zoomOut} aria-label="Zoom out">
				<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
					<path fill="currentColor" d="M2 7h12v2H2V7z" />
				</svg>
			</button>
			<button type="button" class="tool" onclick={resetView} aria-label="Reset view">
				<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
					<path
						fill="currentColor"
						d="M8 1.5A6.5 6.5 0 1 0 14.3 8h-1.6A4.9 4.9 0 1 1 8 3.1V1.5zm2.4 1.3L8 5.2V1.5l2.4 1.3z"
					/>
				</svg>
			</button>
			<button
				type="button"
				class="tool"
				onclick={toggleFullscreen}
				aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
			>
				{#if fullscreen}
					<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
						<path
							fill="currentColor"
							d="M5 3v2H3v1.5h3.5V3H5zm6 0h-1.5v3.5H13V5h-2V3zM3 11v-1.5h3.5V13H5v-2H3zm6.5.5V13H13v-2h-2v-1.5H9.5z"
						/>
					</svg>
				{:else}
					<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
						<path
							fill="currentColor"
							d="M2 2h4v1.5H3.5V6H2V2zm8 0h4v4h-1.5V3.5H10V2zM2 10h1.5v2.5H6V14H2v-4zm9.5 2.5V10H14v4h-4v-1.5h2.5z"
						/>
					</svg>
				{/if}
			</button>
		</div>
		<!-- mermaid sanitizes its own output (securityLevel: strict) -->
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<div
			class="viewport"
			role="region"
			aria-label="Interactive diagram"
			{@attach (node) => {
				viewportEl = node;
				scheduleAutoFit();
				return () => {
					viewportEl = undefined;
				};
			}}
			onpointerdown={onPointerDown}
			onpointermove={onPointerMove}
			onpointerup={onPointerUp}
			onpointercancel={onPointerUp}
		>
			<div
				class="canvas"
				style:transform
				{@attach (node) => {
					canvasEl = node;
					scheduleAutoFit();
					return () => {
						canvasEl = undefined;
					};
				}}
			>
				{@html svg}
			</div>
		</div>
	</figure>
{:else}
	<div class="docsmith-mermaid-skeleton not-prose" role="status" aria-label="Loading diagram"
	></div>
{/if}

<style>
	.docsmith-mermaid {
		position: relative;
		margin: 1.5rem 0;
		width: 100%;
		min-height: 18rem;
		display: flex;
		flex-direction: column;
		border: 1px solid var(--border);
		border-radius: var(--radius, 0.375rem);
		background: var(--background);
		overflow: hidden;
		animation: docsmith-mermaid-in 0.25s ease-out;
	}

	.docsmith-mermaid.is-fullscreen {
		width: 100%;
		height: 100%;
		min-height: 100%;
		margin: 0;
		border-radius: 0;
		background: var(--background);
	}

	.toolbar {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		z-index: 2;
		display: flex;
		gap: 0.25rem;
	}

	.tool {
		appearance: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.75rem;
		height: 1.75rem;
		padding: 0;
		border: 1px solid var(--border);
		border-radius: var(--radius, 0.375rem);
		background: color-mix(in oklab, var(--background) 88%, transparent);
		color: var(--foreground);
		cursor: pointer;
	}

	.tool:hover {
		background: var(--muted);
	}

	.tool:focus-visible {
		outline: 2px solid var(--border);
		outline-offset: 2px;
	}

	.viewport {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 18rem;
		padding: 1.25rem 1rem 1rem;
		overflow: auto;
		cursor: grab;
		touch-action: none;
	}

	.viewport:active {
		cursor: grabbing;
	}

	.canvas {
		transform-origin: center top;
		will-change: transform;
	}

	.canvas :global(svg) {
		display: block;
		max-width: 100%;
		height: auto;
	}

	@keyframes docsmith-mermaid-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.docsmith-mermaid {
			animation: none;
		}
	}

	.docsmith-mermaid-fallback {
		margin: 1.5rem 0;
		padding: 1rem;
		border-radius: var(--radius, 0.375rem);
		border: 1px solid var(--border);
		background: var(--muted);
		overflow-x: auto;
		font-size: 0.85rem;
		line-height: 1.5;
	}
</style>
