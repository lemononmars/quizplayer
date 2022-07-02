<script lang=ts>
   import type {INews} from '$lib/interfaces'
   export let content: INews

   const imgUrl = new URL(`/src/lib/images/news/${content.image}`, import.meta.url).href
</script>

<div class="flex flex-col gap-2">
   <div>
      <img src="{imgUrl}" class="w-full h-60 object-cover" alt="img">
   </div>
   <h1>{content.title}</h1>
   <div class="flex flex-row gap-2 mx-auto items-center">
      <p>{content.date}</p>
      {#if content.tags}
         {#each content.tags as t}
            <div class="badge badge-outline">{t}</div>
         {/each}
      {/if}
   </div>
   <div class="divider"></div>
</div>