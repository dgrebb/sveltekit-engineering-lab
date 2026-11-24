import type { CustomFields } from '#lib/frontmatter.ts';

declare global {
	namespace App {
		interface Locals {
			sessionId: string;
		}
	}
}

declare module 'svelte-docsmith' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface DocsCustomFields extends CustomFields {}
}

export {};
