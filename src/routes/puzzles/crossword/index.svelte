<script lang=ts>
   import ContentBlock from '$lib/components/ContentBlock.svelte'
   import type { IPuzzleCrossword } from '$lib/interfaces';
   export let crosswords: IPuzzleCrossword[]
</script>

<svelte:head>
   <title>Code Breaker | Crossword Puzzles</title>
</svelte:head>

<h1>อักษรไขว้</h1>

<div class="grid lg:grid-cols-2 px-2 gap-2" >
   {#each crosswords as content}
      <ContentBlock {content}/>
   {/each}
</div>

