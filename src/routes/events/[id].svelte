<script lang=ts>
   import type {IEvent} from '$lib/interfaces'
   export let content: IEvent

   const imgUrl = new URL(`/src/lib/images/events/${content.image}`, import.meta.url).href
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
   <pre class="whitespace-pre-wrap text-left">{content.content}</pre>
</div>