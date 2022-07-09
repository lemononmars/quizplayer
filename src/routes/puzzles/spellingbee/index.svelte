<script lang=ts>
   import {dateToThaiString} from '$lib/utils/date'
   import type { ISpellingBee } from '$lib/interfaces';
   export let puzzles: ISpellingBee[]

   // slice for now, should shuffle later
   puzzles = puzzles.slice(0, 10)
</script>

<svelte:head>
   <title>Code Breaker | Spelling Bee</title>
</svelte:head>

<h1>Spelling Bee</h1>

<div class="flex flex-col justify-center">
   <table class="table table-zebra table-compact w-full mx-auto">
      <thead>
         <th>ชื่อ</th>
         <th>วันที่</th>
         <th>ผู้แต่ง</th>
         <th>แท็ก</th>
      </thead>
      <tbody>
         {#each puzzles as p}
            <tr>
               <td>
                  <a href="/puzzles/spellingbee/{p.id}">
                     <p class="text-primary">{p.title}</p>
                  </a>
               </td>
               <td>{dateToThaiString(p.date)}</td>
               <td>{p.author || 'ไม่มี'}</td>
               <td>
                  {#each p.tags || [] as t}
                     <div class="badge badge-outline">{t}</div>
                  {/each}
               </td>
            </tr>
         {/each}
      </tbody>
   </table>
</div>

