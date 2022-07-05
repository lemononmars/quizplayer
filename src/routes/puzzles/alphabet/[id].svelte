<script lang=ts>
   import type {IAlphabet} from '$lib/interfaces'
   import LetterInput from '$lib/components/LetterInput.svelte';

   import TitleTab from '$lib/components/TitleTab.svelte';
   import {fly} from 'svelte/transition'

   export let content: IAlphabet

   let solved: boolean = false
   let submitted: boolean = false

   let isPaused: boolean = true
   let loading: boolean = false

   let answer: string = ''
   let duplicate: boolean = false
   let pastAnswers: string[] = []

   $: length = pastAnswers.length
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
      if(currentRound == numRounds - 1) {
         openModal = true
      }
      else {
         loading = true
         // wait 3 seconds before starting next round
         setTimeout(()=> {
            currentRound ++
            submitted = false
            solved = false
            pastAnswers = []
            loading = false
         }
         , 3000)
      }
   }

   function handleKeyPress(event: KeyboardEvent) {
		if (event.code != "Enter") return;
		checkAnswer()
	}

   function togglePlay() {
      isPaused = !isPaused
   }
</script>

<TitleTab {content}/>

<div class="flex flex-col gap-2 pb-10">
   <h1>รอบที่ {currentRound + 1} / {numRounds}</h1>
   <h2>คำใบ้: {roundHint}</h2>

   {#if !loading}
      {#each Array(numRounds).fill('') as r, idx}
         {#if currentRound == idx}
            <div transition:fly={{x:100, duration: 300}}>
               <LetterInput word={content.answers[idx]} on:togglePlay={togglePlay}/>
            </div>
         {/if}
      {/each}
   {:else}
      <div class="btn loading"></div>
   {/if}

   <div class="divider"></div>
   
   {#if !solved && isPaused}
      <div class="input-group w-72 mx-auto">
         <input class="input input-bordered" type="text" bind:value={answer} on:keydown={handleKeyPress}>
         <div class="btn btn-primary " on:click={checkAnswer}>ตอบ</div>
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