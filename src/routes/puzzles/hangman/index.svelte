<script lang=ts>
   import ContentBlock from '$lib/components/ContentBlock.svelte'
   import type { IHangman } from '$lib/interfaces';
   export let puzzles: IHangman[]
</script>

<svelte:head>
   <title>Code Breaker | Hangman</title>
</svelte:head>

<h1>อักษรล่าแสน</h1>

<div class="grid lg:grid-cols-2 px-2 gap-2" >
   {#each puzzles as content}
      <ContentBlock {content}/>
   {/each}
</div>

