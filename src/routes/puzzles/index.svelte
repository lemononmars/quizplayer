<script lang=ts>
   const imgUrl = new URL(`/src/lib/images/puzzles/crossword/crossword.png`, import.meta.url).href

   const puzzleDescriptions = [
      {
         type: "rebus",
         description: "ทายคำจากภาพ",
         icon: imgUrl
      },
      {
         type: "crossword",
         description: "ปริศนาอักษรไขว้",
         icon: imgUrl
      },
      {
         type: "alphabet",
         description: "ทายคำจากคำใบ้ โดยเปิดตัวอักษรให้น้อยที่สุด",
         icon: imgUrl
      },
   ]

</script>

<svelte:head>
   <title>Code Breaker | Puzzles</title>
</svelte:head>

<h1>ประเภทปริศนาทั้งหมด</h1>

<div class="divider"></div>

<div class="grid lg:grid-cols-2 px-2 gap-2" >
   {#each puzzleDescriptions as p}
      <a href="/puzzles/{p.type}">
         <div class="flex flex-row gap-2 border-2">
            <div>
               <img src="{p.icon}" class="w-32 aspect-square object-cover" alt="img">
            </div>
            <div class="text-center mx-auto grid content-between">
               <h1 class="capitalize">{p.type}</h1>
               <div>
                  <p class="text-md text-left">{p.description}</p>
               </div>
            </div>
         </div>
      </a>
   {/each}
</div>


