<script lang=ts>
   import {getImageURL} from '$lib/supabase'

   const puzzleDescriptions = [
      {
         type: "rebus",
         description: "ทายคำจากภาพ",
         icon: getImageURL('assets', 'rebus.png')
      },
      {
         type: "crossword",
         description: "ปริศนาอักษรไขว้",
         icon: getImageURL('assets', 'crossword.png')
      },
      {
         type: "alphabet",
         description: "ทายคำจากคำใบ้ โดยเปิดตัวอักษรให้น้อยที่สุด",
         icon: getImageURL('assets', 'alphabet.png')
      },
      {
         type: "spellingbee",
         description: "หาคำ 7 ตัวอักษร",
         icon: getImageURL('assets', 'spellingbee.png')
      },
      {
         type: "puzzlehunt",
         description: "แก้ชุดปริศนา",
         icon: getImageURL('assets', 'puzzlehunt.png')
      },
      {
         type: "adventure",
         description: "ไต่",
         icon: getImageURL('assets', 'adventure.png')
      },
   ]

</script>

<svelte:head>
   <title>Code Breaker | Puzzles</title>
</svelte:head>

<h1>ประเภทปริศนาทั้งหมด</h1>

<div class="divider"></div>

<div class="grid lg:grid-cols-2 px-2 gap-2">
   {#each puzzleDescriptions as p}
      <a href="/puzzles/{p.type}">
         <div class="flex flex-row gap-2 border-2 shadow-lg shadow-white hover:scale-105 transition ease-in-out hover:bg-info-content m-4">
            <div>
               <img src="{p.icon}" class="h-32 aspect-square object-cover" alt="img">
            </div>
            <div class="text-center mx-auto grid content-between">
               <h1 class="capitalize">{p.type}</h1>
               <div class="mb-2">
                  <p class="text-md text-left">{p.description}</p>
               </div>
            </div>
         </div>
      </a>
   {/each}
</div>


