<script>
   import "../app.css";
   import Navbar from "$lib/components/Navbar.svelte";
   import { navigating } from '$app/stores';
	import PageNavIndicator from '$lib/components/PageNavIndicator.svelte';
	import { onMount } from "svelte";

	onMount(async()=>{
		VANTA.NET({
			el: "#main",
			mouseControls: true,
			touchControls: true,
			gyroControls: false,
			minHeight: 200.00,
			minWidth: 200.00,
			scale: 1.00,
			scaleMobile: 1.00,
			color: 0x42963e,
			backgroundColor: 0x000000
		})
	})

</script>

<header class="w-screen fixed overflow-x-clip bottom-0 lg:top-0 h-fit z-20">
	{#if $navigating}
		<PageNavIndicator />
	{/if}
	<Navbar/>
</header>

<svelte:head>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"></script>
</svelte:head>

<main class="overflow-x-clip w-screen" id="main">
	<div>
   <slot />
	</div>
</main>