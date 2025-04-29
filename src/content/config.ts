import { z, defineCollection } from 'astro:content';

const burritosCollection = defineCollection({
	type: 'content',
	schema: ({ image }) =>
		z.object({
			restaurant: z.string(),
			website: z.string().url(),
			address: z.string(),
			item: z.string(),
			stars: z.number(),
			imagePrimary: image(),
			imageLength: image(),
			imagePackage: image(),
			price: z.number(),
			closed: z.boolean().optional()
		})
});

export const collections = {
	burritos: burritosCollection
};
