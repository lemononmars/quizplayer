<script lang=ts>
   import type {IContent} from '$lib/interfaces'
   export let content: IContent

   const url = content.type === 'news' ? 'news': 'puzzles/' + content.type

   const imgUrl = new URL(`/src/lib/images/${url}/${content.image}`, import.meta.url).href
</script>

<a href="./{url}/{content.id}">
<div class="flex flex-row gap-2 border-2">
   <div>
      <img src="{imgUrl}" class="w-32 aspect-square object-cover" alt="img">
   </div>
   <div class="text-center mx-auto grid content-between">
      <h1>{content.title}</h1>
      <div>
         {#if content.tags}
            {#each content.tags as t}
               <a href="/{url}?tag={t}"><div class="badge badge-outline">{t}</div></a>
            {/each}
         {/if}
         <p class="text-sm">{content.date}</p>
      </div>
   </div>
</div>
</a>