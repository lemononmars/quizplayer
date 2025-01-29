<script lang=ts>
   import {answers, numPuzzles, puzzleTitles} from '$lib/data/puzzles/carddeck/vol1'

   let answer:string = ""
   let lastAnswer: string = ""
   let solved:boolean = false
   let submitting:boolean = false
   let response:string = ""

   let puzzle = -1

   function submitAnswer() {
      if(submitting) return
      submitting = true
      solved = false
      response = "."
      for(var i = 1; i < 5; i ++) {
         setTimeout(()=>{response = response+"."}, i*100)
      }
      setTimeout(checkAnswer,500)
   }

   function checkAnswer(){
      answer = answer.toUpperCase()
      submitting = false
      lastAnswer = '"' + answer + '"'
      if(answer == answers[puzzle].toUpperCase()){
         solved = true
         response = "เป็นคำตอบที่ถูกต้อง!"
      }
      else{
         solved = false
         response = "ยังไม่ใช่คำตอบที่ถูก"
      }
   }
   
   function handleKeyPress(event: KeyboardEvent) {
      console.log(event.code)
		if (event.code != "Enter") return;
		submitAnswer()
	}

   function resetAnswer(){
      answer = ""
      lastAnswer = ""
      response = ""
      solved = false
   }

   function focusOnMount(node) {
		node.focus();
	}
</script>

<svelte:head>
   <title>Code Breaker | Puzzle Card Deck Vol.1 Checker</title>
</svelte:head>

<h1><a href="./">Puzzle Card Deck Vol.1</a></h1>

<div class="btn btn-outline btn-warning btn-xs"><a href="./hint">ไปหน้าขอคำใบ้</a></div>
   
<div class="flex flex-col justify-center gap-y-4 my-4">
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
         <div class="input-group w-max mx-auto">
            {#key puzzle}
               <input class="input input-bordered" type="text" bind:value={answer} on:keypress={handleKeyPress} use:focusOnMount>
            {/key}
            <div class="btn btn-primary " on:click={submitAnswer} on:keypress={handleKeyPress}>ตรวจคำตอบ</div>
         </div>
         {#if submitting}
            <p class="text-accent">{response}</p>
         {:else if solved}
            <p class="text-success">{lastAnswer} {response}</p>
         {:else}
            <p class="text-error">{lastAnswer} {response}</p>
         {/if}
      </div>
   {/if}
</div>