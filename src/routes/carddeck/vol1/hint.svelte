<script lang=ts>
   const hintinfo = [
      {
         title: "ข้อที่ 1",
         hints: ["สี", "พระ", "อาทิตย์"],
         answer: "แดง"
      },
      {
         title: "ข้อที่ 2",
         hints: ["ปลา", "สอง", "หน้า"],
         answer: "ทูน่า"
      }
   ]
   let puzzle: number = -1
   let step: number = 0
   let hintButtonText: string = "คำใบ้ต่อไป"
   $: numHints = puzzle == -1? 0: hintinfo[puzzle].hints.length

   function nextHint(){
      step++
      if (numHints == step-2) {
         hintButtonText = "เปิดเฉลย"
      }
   }

   function resetHint(){
      hintButtonText = "คำใบ้ต่อไป"
      step = 0
      puzzle = -1
   }
</script>

<svelte:head>
   <title>Code Breaker | Puzzle Card Deck Vol.1</title>
</svelte:head>


<h1>Puzzle Card Deck Vol.1</h1>

<div class="flex flex-col justify-center">
   <div class="w-full lg:w-1/2 mx-auto">
      {#if puzzle == -1}
         <h1>เลือกปริศนาที่ต้องการคำใบ้</h1>
      {:else if step < numHints}
         <h1>คำใบ้ปริศนาที่ {puzzle+1}</h1>
         <h2>คำใบ้ที่ {step+1} / {hintinfo[puzzle].hints.length}</h2>
         <div>{hintinfo[puzzle].hints[step]}</div>
      {:else}
         <h1>เฉลยปริศนาที่ {puzzle+1}</h1>
         <h3>{hintinfo[puzzle].answer}</h3>
      {/if}

      <div class="flex flex-col w-full gap-y-2">
         {#if puzzle == -1}
            {#each hintinfo as h, idx}
               <div class="btn btn-outline btn-info" on:click={()=>puzzle = idx}>{h.title}</div>
            {/each}
         {:else if step < numHints}
            <div class="btn btn-outline btn-info" on:click={nextHint}>{hintButtonText}</div>
         {:else}
            <div class="btn btn-outline btn-info" on:click={resetHint}>กลับหน้าคำใบ้แรก</div>
         {/if}
      </div>
   </div>
</div>
