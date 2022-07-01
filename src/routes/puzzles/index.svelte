<script lang=ts>
   import ContentBlock from '$lib/components/ContentBlock.svelte'
   export let puzzles: Record<string, any>
   const keys = Object.keys(puzzles)
</script>

<svelte:head>
   <title>Code Breaker | Crossword Puzzles</title>
</svelte:head>

{#each keys as key}
   <a href="/puzzle/{key}">
      <h2 class="text-3xl m-4 capitalize">{key}</h2>
   </a>
   <div class="grid lg:grid-cols-2 px-2 gap-2" >
      {#each puzzles[key] as content}
         <ContentBlock {content}/>
      {/each}
   </div>
{/each}

