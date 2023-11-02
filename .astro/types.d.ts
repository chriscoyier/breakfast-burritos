declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"burritos": {
"active_culture.md": {
	id: "active_culture.md";
  slug: "active_culture";
  body: string;
  collection: "burritos";
  data: InferEntrySchema<"burritos">
} & { render(): Render[".md"] };
"bend_breakfast_burrito.md": {
	id: "bend_breakfast_burrito.md";
  slug: "bend_breakfast_burrito";
  body: string;
  collection: "burritos";
  data: InferEntrySchema<"burritos">
} & { render(): Render[".md"] };
"black_bear_diner.md": {
	id: "black_bear_diner.md";
  slug: "black_bear_diner";
  body: string;
  collection: "burritos";
  data: InferEntrySchema<"burritos">
} & { render(): Render[".md"] };
"boneyard.md": {
	id: "boneyard.md";
  slug: "boneyard";
  body: string;
  collection: "burritos";
  data: InferEntrySchema<"burritos">
} & { render(): Render[".md"] };
"burger_king.md": {
	id: "burger_king.md";
  slug: "burger_king";
  body: string;
  collection: "burritos";
  data: InferEntrySchema<"burritos">
} & { render(): Render[".md"] };
"burrito_sunrise.md": {
	id: "burrito_sunrise.md";
  slug: "burrito_sunrise";
  body: string;
  collection: "burritos";
  data: InferEntrySchema<"burritos">
} & { render(): Render[".md"] };
"don_gabinos.md": {
	id: "don_gabinos.md";
  slug: "don_gabinos";
  body: string;
  collection: "burritos";
  data: InferEntrySchema<"burritos">
} & { render(): Render[".md"] };
"hideaway.md": {
	id: "hideaway.md";
  slug: "hideaway";
  body: string;
  collection: "burritos";
  data: InferEntrySchema<"burritos">
} & { render(): Render[".md"] };
"life_and_time.md": {
	id: "life_and_time.md";
  slug: "life_and_time";
  body: string;
  collection: "burritos";
  data: InferEntrySchema<"burritos">
} & { render(): Render[".md"] };
"los_jalepenos.md": {
	id: "los_jalepenos.md";
  slug: "los_jalepenos";
  body: string;
  collection: "burritos";
  data: InferEntrySchema<"burritos">
} & { render(): Render[".md"] };
"lucys_bacon.md": {
	id: "lucys_bacon.md";
  slug: "lucys_bacon";
  body: string;
  collection: "burritos";
  data: InferEntrySchema<"burritos">
} & { render(): Render[".md"] };
"market_of_choice_green_chile.md": {
	id: "market_of_choice_green_chile.md";
  slug: "market_of_choice_green_chile";
  body: string;
  collection: "burritos";
  data: InferEntrySchema<"burritos">
} & { render(): Render[".md"] };
"mcdonalds.md": {
	id: "mcdonalds.md";
  slug: "mcdonalds";
  body: string;
  collection: "burritos";
  data: InferEntrySchema<"burritos">
} & { render(): Render[".md"] };
"rockin_daves.md": {
	id: "rockin_daves.md";
  slug: "rockin_daves";
  body: string;
  collection: "burritos";
  data: InferEntrySchema<"burritos">
} & { render(): Render[".md"] };
"safeway.md": {
	id: "safeway.md";
  slug: "safeway";
  body: string;
  collection: "burritos";
  data: InferEntrySchema<"burritos">
} & { render(): Render[".md"] };
"sharis.md": {
	id: "sharis.md";
  slug: "sharis";
  body: string;
  collection: "burritos";
  data: InferEntrySchema<"burritos">
} & { render(): Render[".md"] };
"sintra.md": {
	id: "sintra.md";
  slug: "sintra";
  body: string;
  collection: "burritos";
  data: InferEntrySchema<"burritos">
} & { render(): Render[".md"] };
"sisters_coffee.md": {
	id: "sisters_coffee.md";
  slug: "sisters_coffee";
  body: string;
  collection: "burritos";
  data: InferEntrySchema<"burritos">
} & { render(): Render[".md"] };
"sol_verde.md": {
	id: "sol_verde.md";
  slug: "sol_verde";
  body: string;
  collection: "burritos";
  data: InferEntrySchema<"burritos">
} & { render(): Render[".md"] };
"strictly_organic.md": {
	id: "strictly_organic.md";
  slug: "strictly_organic";
  body: string;
  collection: "burritos";
  data: InferEntrySchema<"burritos">
} & { render(): Render[".md"] };
"taco_salsa.md": {
	id: "taco_salsa.md";
  slug: "taco_salsa";
  body: string;
  collection: "burritos";
  data: InferEntrySchema<"burritos">
} & { render(): Render[".md"] };
"taqueria_el_nava.md": {
	id: "taqueria_el_nava.md";
  slug: "taqueria_el_nava";
  body: string;
  collection: "burritos";
  data: InferEntrySchema<"burritos">
} & { render(): Render[".md"] };
};
"burritos-pending": {
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
