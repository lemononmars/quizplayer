<script lang=ts>
   import type {IHangman} from '$lib/interfaces'
   import LetterInput from '$lib/components/LetterInput.svelte';
   export let content: IHangman

   let solved: boolean = false
   let submitted: boolean = false

   let answer: string = ''
   let duplicate: boolean = false
   let showAnswer: boolean = false
   let pastAnswers: string[] = []

   $: length = pastAnswers.length
   let numHints: number = 0
   const numRounds = content.answers.length
   let currentRound = 0
   $: roundAnswer = content.answers[currentRound]
   $: roundHint = content.hints[currentRound]

   let openModal: boolean = false

   function checkAnswer() {
      if(solved) return

      submitted = true
      duplicate = false
      if(pastAnswers.includes(answer)) {
         duplicate = true
         return 
      }

      pastAnswers = [...pastAnswers, answer]
      if(answer === roundAnswer) {
         solved = true
         nextRound()
      }
      answer = ''
   }

   function nextRound(){
      if(currentRound === numRounds - 1) {
         openModal = true
      }
      else {
         // wait 3 seconds before starting next round
         setTimeout(()=> {
            currentRound ++
            submitted = false
            solved = false
            pastAnswers = []
         }
         , 3000)
      }
   }

   function handleKeyPress(event: KeyboardEvent) {
		if (event.code != "Enter") return;
		checkAnswer()
	}
</script>

<div class="flex flex-col gap-2 pb-10">
   <h1>{content.title}</h1>
   <div class="flex flex-row items-center gap-2 mx-auto">
      <p>วันที่ {content.date}</p>
      {#if content.tags}
         {#each content.tags as t}
            <a href="/puzzles/rebus?tag={t}"><div class="badge badge-outline">{t}</div></a>
         {/each}
      {/if}
   </div>

   <h1>รอบที่ {currentRound + 1} / {numRounds}</h1>
   <h2>{roundHint}</h2>

   {#each Array(numRounds).fill('') as r, idx}
      <LetterInput word={content.answers[idx]}/>
   {/each}
   
   {#if !solved}
      <div class="input-group w-72 mx-auto">
         <input class="input input-bordered" type="text" bind:value={answer} on:keydown={handleKeyPress}>
         <div class="btn btn-primary " on:click={checkAnswer}>ตรวจคำตอบ</div>
      </div>
   {/if}
   {#if submitted}
      {#if duplicate}
         <p class="text-warning">เคยส่งคำตอบนี้ไปแล้ว</p>
      {/if}
      <h1>คำตอบก่อนหน้านี้</h1>
      {#each pastAnswers as _, idx}
         {#if idx == 0 && solved}
            <p class="text-success">"{pastAnswers[length - 1]}" เป็นคำตอบที่ถูกต้อง!</p>
         {:else}
            <p class="text-error">"{pastAnswers[length - idx - 1]}" ยังไม่ถูก</p>
         {/if}
      {/each}
   {/if}

   <div class="btn" on:click={nextRound}>Next puzzle</div>
</div>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="submit-modal" class="modal-toggle"/>
<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="modal cursor-pointer w-screen" class:modal-open={openModal} on:click={()=>openModal = false}>
   <label class="modal-box relative" for="">
      <h3 class="text-xl font-bold m-2">คุณแก้ปริศนาครบทั้ง {numRounds} ข้อแล้ว 🎉</h3>
      <div class="btn btn-block btn-outline" on:click={()=>openModal = false}>เย่!</div>
   </label>
</label>