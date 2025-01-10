<script context="module">
	export function load({ error, status }) {
		return {
			props: {
				error,
				status
			}
		};
	}
</script>

<script>
	import { dev } from '$app/env';
	export let error, status;
</script>

<svelte:head>
	<title>{status}</title>
</svelte:head>

<div class="col-md-9">

	<h1>หน้านี้ไม่มีอยู่จริงนะ</h1>
	<h2>{status}</h2>

	<p>{error.message}</p>

	{#if dev && error.stack}
		<pre>{error.stack}</pre>
	{/if}
</div>
