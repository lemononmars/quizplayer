<script lang=ts>
   import {hints, answers, puzzleTitles} from '$lib/data/puzzles/carddeck/vol1'

   let puzzle: number = -1
   let step: number = 0
   $: numHints = puzzle == -1? 0: hints[puzzle].length

   function nextHint(){
      step++
   }

   function resetHint(){
      step = 0
      puzzle = -1
   }
</script>

<svelte:head>
   <title>Code Breaker | Puzzle Card Deck Vol.1</title>
</svelte:head>


<h1><a href="./">Puzzle Card Deck Vol.1</a></h1>

<div class="btn btn-outline btn-warning btn-xs"><a href="./check">ไปหน้าตรวจคำตอบ</a></div>

<div class="divider"></div>

<div class="flex flex-col justify-center">
   <div class="w-full lg:w-1/2 mx-auto h-1/2 p-4">
      {#if puzzle == -1}
         <h2>เลือกปริศนาที่ต้องการคำใบ้</h2>
      {:else}
         <div class="breadcrumbs text-sm m-4 text-wrap">
            <ul>
               <li><a on:click={resetHint}>เลือกข้ออื่น</a></li>
               {#each Array(step) as _, idx}
                  <li><a on:click={()=> {step = idx}}>คำใบ้ที่ {idx+1}</a> </li>
               {/each}
            </ul>
         </div>
         {#if step < numHints}
            <h2>คำใบ้{puzzleTitles[puzzle]}</h2>
            <div class="h-36">
               <h3>คำใบ้ที่ {step+1} / {hints[puzzle].length}</h3>
               <h4 class="text-left">{hints[puzzle][step]}</h4>
            </div>
         {:else}
            <h2>เฉลย{puzzleTitles[puzzle]}</h2>
            <div class="text-xl text-warning">{answers[puzzle]}</div>
         {/if}
      {/if}

      <div class="flex flex-col w-full gap-y-2 mx-auto">
         {#if puzzle == -1}
            {#each puzzleTitles as t, idx}
               <div class="btn btn-outline btn-info text-lg" on:click={()=>puzzle = idx}>{t}</div>
            {/each}
         {:else if step < numHints-1}
            <div class="btn btn-outline btn-info text-lg" on:click={nextHint}>คำใบ้ต่อไป</div>
         {:else if step == numHints-1}
            <div class="btn btn-warning text-lg" on:click={nextHint}>เปิดเฉลย</div>
         {:else}
            <div class="btn btn-outline btn-success text-lg" on:click={resetHint}>กลับหน้าคำใบ้แรก</div>
         {/if}
      </div>
   </div>
</div>
