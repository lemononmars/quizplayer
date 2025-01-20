<script lang=ts>
   let answer:string = ""
   let solved:boolean = false
   let response:string = ""
   
   const puzzleTitles = ["ข้อที่ 1","ข้อที่ 2","ข้อที่ 3"]
   const solutions = ["A", "B", "C"]

   let puzzle = -1

   function checkAnswer(){
      if(answer.toUpperCase() == solutions[puzzle].toUpperCase()){
         solved = true
         response = "ถูก!"
      }
      else{
         response = "ยังไม่ถูก"
      }
   }
   
   function handleKeyPress(event: KeyboardEvent) {
		if (event.code != "Enter") return;
		checkAnswer()
	}

   function resetAnswer(){
      answer = ""
      response = ""
      solved = false
   }
</script>

<svelte:head>
   <title>Code Breaker | Puzzle Card Deck Vol.1 Checker</title>
</svelte:head>


<h1>Puzzle Card Deck Vol.1</h1>
   
<div class="flex flex-col justify-center gap-y-4">
   <div class="w-full">
      <select class="select select-bordered w-full max-w-xs" bind:value={puzzle} on:change={resetAnswer}>
         <option disabled selected>เลือกปริศนา</option>
         {#each puzzleTitles as p, idx}
            <option value={idx}>{p}</option>
         {/each}
      </select>
   </div>

   {#if puzzle > -1}
      <div class="flex flex-col gap-y-2 mx-auto">
         <div class="input-group w-72 mx-auto">
            <input class="input input-bordered" type="text" bind:value={answer}>
            <div class="btn btn-primary " on:click={checkAnswer} on:keydown={handleKeyPress}>ตรวจคำตอบ</div>
         </div>
         {#if solved}
            <p class="text-success">{response}</p>
         {:else}
            <p class="text-error">{response}</p>
         {/if}
      </div>
   {/if}
</div>