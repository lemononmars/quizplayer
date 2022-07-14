<script lang=ts>
   import ContentBlock from '$lib/components/ContentBlock.svelte'
   import type { IPuzzleHunt } from '$lib/interfaces';
   
   export let puzzleHunts: IPuzzleHunt[]
</script>

<svelte:head>
   <title>Code Breaker | Puzzle Hunts</title>
</svelte:head>

<h1>Puzzle Hunts</h1>

<div class="grid lg:grid-cols-2 px-2 gap-2" >
   {#each puzzleHunts as content}
      <ContentBlock {content}/>
   {/each}
</div>

