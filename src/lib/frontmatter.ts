import * as v from 'valibot';

/**
 * Custom DocSmith frontmatter fields for lesson pages.
 * Built-in fields (title, description, section, order, …) are validated separately.
 */
export const customFields = v.strictObject({
	difficulty: v.optional(v.picklist(['beginner', 'intermediate', 'advanced'])),
	status: v.optional(v.picklist(['planned', 'exploring', 'complete'])),
	duration: v.optional(v.number()),
	primitives: v.optional(v.array(v.string())),
	fixtures: v.optional(v.array(v.string())),
	topics: v.optional(v.array(v.string()))
});

export type CustomFields = v.InferOutput<typeof customFields>;
