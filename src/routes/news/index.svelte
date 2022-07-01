<script lang=ts>
   import ContentBlock from '$lib/components/ContentBlock.svelte'
   import type { INews } from '$lib/interfaces';
   
   export let news: INews[]
</script>

<svelte:head>
   <title>Code Breaker | News</title>
</svelte:head>

<h1>News</h1>

<div class="grid lg:grid-cols-2 px-2 gap-2" >
   {#each news as content}
      <ContentBlock {content}/>
   {/each}
</div>

