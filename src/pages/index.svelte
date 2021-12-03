<script context="module">
	export const prerender = true;

	import { base } from '$app/paths';
  export async function load({ fetch }) {
    const posts = await fetch(`${base}/index.json`)
        .then((r) => r.json());
    return {
      props: { posts }
    }
  }
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	{#each posts as post}
    <a href={`${base}/${post.slug}`}>
      <h2 class="title">{post.metadata.title}</h2>
      <p>{post.metadata.excerpt}</p>
    </a>
  {/each}
</section>
  
<style>
	
</style>
