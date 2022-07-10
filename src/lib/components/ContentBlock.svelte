<script lang=ts>
   import type {IContent} from '$lib/interfaces'
   export let content: IContent

   const url = content.type === 'event' ? 'events': 'puzzles/' + content.type

   const imgUrl = new URL(`/src/lib/images/${url}/${content.image}`, import.meta.url).href
</script>

<a href="/{url}/{content.id}">
   <div class="card card-side bg-base-100 shadow-xl border-2">
      <figure><img src="{imgUrl}" alt="event" class="h-32 aspect-square object-scale-down"></figure>
      <div class="card-body">
      <h2 class="card-title">{content.title}</h2>
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