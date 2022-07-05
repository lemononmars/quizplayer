<script lang=ts>
   const crossUrl = new URL(`/src/lib/images/icons/crossword.png`, import.meta.url).href
   const alphaUrl = new URL(`/src/lib/images/icons/alphabet.png`, import.meta.url).href
   const rebusUrl = new URL(`/src/lib/images/icons/rebus.png`, import.meta.url).href

   const puzzleDescriptions = [
      {
         type: "rebus",
         description: "ทายคำจากภาพ",
         icon: rebusUrl
      },
      {
         type: "crossword",
         description: "ปริศนาอักษรไขว้",
         icon: crossUrl
      },
      {
         type: "alphabet",
         description: "ทายคำจากคำใบ้ โดยเปิดตัวอักษรให้น้อยที่สุด",
         icon: alphaUrl
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
         <div class="flex flex-row gap-2 border-2 shadow-lg hover:scale-105 transition ease-in-out hover:bg-info-content">
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


