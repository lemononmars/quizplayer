<script lang=ts>
   import ContentBlock from '$lib/components/ContentBlock.svelte'
   import type { IPuzzle } from '$lib/interfaces';
   export let puzzles: IPuzzle[]
</script>

<svelte:head>
   <title>Code Breaker | Rebus</title>
</svelte:head>

<h1>ภาพปริศนา</h1>

<div class="grid lg:grid-cols-2 px-2 gap-2" >
   {#each puzzles as content}
      <ContentBlock {content}/>
   {/each}
</div>

