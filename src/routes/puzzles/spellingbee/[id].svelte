<script lang=ts>
   import type {ISpellingBee} from '$lib/interfaces'
   import TitleTab from '$lib/components/TitleTab.svelte';
   import {search} from '$lib/utils/thaiwords'
   import {fade} from 'svelte/transition'

   export let content: ISpellingBee

   let answer: string = ''
   let pastAnswers: string[] = []
   interface SubmissionLog {
      answer: string
      response: string
   }
   let logs: SubmissionLog[] = []

   let {letters, pangram, solutions} = content
   solutions = solutions.filter(s => s.length >= 3)
   letters = shuffle(letters)
   let solved = new Array(solutions.length).fill(false)

   let openModal: boolean = false

   function checkAnswer() {
      if(pastAnswers.includes(answer)) {
         logs = [{
            answer, response: 'duplicate'
         }, ...logs]
         answer = ''
         return
      }

      if(answer.length < 3) {
         logs = [{
            answer, response: 'short'
         }, ...logs]
         answer = ''
         return
      }

      if (!search(answer)) {
         logs = [{
            answer, response: 'illegal'
         }, ...logs]
         answer = ''
         return
      }

      pastAnswers = [...pastAnswers, answer]
      if(solutions.includes(answer)) {
         solved[solutions.indexOf(answer)] = true
         logs = [{
            answer, response: 'correct'
         }, ...logs]
      }

      if(pangram.includes(answer)) {
         openModal = true
      }

      answer = ''
   }

   function handleKeyPress(event: KeyboardEvent) {
		if (event.code != "Enter") return;
		checkAnswer()
	}

   function shuffle(s: string[]) {
      const l = s.length
      for(let i = 0; i < l; i ++) {
         const newIndex = Math.floor(Math.random()*(l-i-1))
         const temp = s[newIndex]
         s[newIndex] = s[i]
         s[i] = temp
      }

      return [...s]
   }

   function giveUp() {
      solved = new Array(solutions.length).fill(true)
   }
</script>

<div class="flex flex-col gap-2 pb-10">
   <TitleTab {content}/>

   <div class="flex flex-row gap-2 align-center mx-auto">
   {#each letters as l}
      <p class="text-6xl border-2 w-20 h-20">{l}</p>
   {/each}
   </div>

  
   <div class="flex flex-row mt-10 items-start">
      <div class="flex flex-col gap-2 justify-center">
         <div class="input-group w-72 mx-auto">
            <input class="input input-bordered" type="text" bind:value={answer} on:keydown={handleKeyPress}>
            <div class="btn btn-primary " on:click={checkAnswer}>ส่ง</div>
         </div>
         <h1>คำตอบก่อนหน้านี้</h1>
         {#each logs as l}
            {#if l.response === 'correct'}
               <p class="text-success">"{l.answer}" เป็นคำตอบที่ถูกต้อง!</p>
            {:else if l.response === 'duplciate'}
               <p class="text-warning">"{l.answer}" เคยตอบไปแล้ว</p>
            {:else if l.response === 'illegal'}
               <p class="text-error">"{l.answer}" ไม่อยู่ในพจนานุกรม</p>
            {:else if l.response === 'short'}
               <p class="text-error">"{l.answer}" สั้นไป (อย่างน้อย 3 ตัวอักษร)</p>
            {/if}
         {/each}
      </div>

      <div class="w-full lg:w-1/2 mx-auto">
         คำตอบที่หาเจอแล้ว
         <div class="grid grid-cols-4">
            {#each solutions as s, idx}
               {#if solved[idx]}
                  <p transition:fade={{duration: 1000}}>{s}</p>
               {:else}
                  <p>{s.length}</p>
               {/if}
            {/each}
         </div>
         <div class="btn" on:click={giveUp}>ยอม</div>
      </div>
   </div>
</div>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="submit-modal" class="modal-toggle"/>
<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="modal cursor-pointer w-screen" class:modal-open={openModal} on:click={()=>openModal = false}>
   <label class="modal-box relative" for="">
      <h3 class="text-xl font-bold m-2">"คุณหา pangram เจอแล้ว 🎉</h3>
      <div class="btn btn-block btn-outline" on:click={()=>openModal = false}>เย่!</div>
   </label>
</label>