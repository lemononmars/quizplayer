<script lang=ts>
   import type {IEvent} from '$lib/interfaces'
   import {getImageURL} from '$lib/supabase'
   import {dateToThaiString} from '$lib/utils/date'
   export let content: IEvent

   const url = content.type === 'event' ? 'events': 'puzzles/' + content.type
   const imgURL = getImageURL('events', content.image)
</script>

<a href="/{url}/{content.redirect || content.id}">
   <div class="card card-side bg-base-100 shadow-xl border-2 hover:scale-105 transition-transform">
      <figure><img src="{imgURL}" alt="event" class="h-32 aspect-square object-scale-down"></figure>
      <div class="card-body">
      <h2 class="card-title h-8">{content.title}</h2>
      <div>
         {#if content.tags}
            {#each content.tags as t}
               <a href="/{url}?tag={t}"><div class="badge badge-outline">{t}</div></a>
            {/each}
         {/if}
         <p class="text-sm">{dateToThaiString(content.date)}</p>
      </div>
      </div>
   </div>
</a>