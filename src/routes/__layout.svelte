<script>
   import "../app.css";
   import { navigating } from '$app/stores';
	import PageNavIndicator from '$lib/components/PageNavIndicator.svelte';
</script>

<header class="w-screen fixed overflow-x-clip bottom-0 lg:top-0 h-fit z-20">
	{#if $navigating}
		<PageNavIndicator />
	{/if}
</header>


<main class="overflow-x-clip" id="main">
	<div>
   <slot />
	</div>
</main>