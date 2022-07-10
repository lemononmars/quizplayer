<script lang=ts>
   import { goto } from '$app/navigation';

   import { getRandomPuzzle } from '$lib/data/puzzles/spellingbee';
   import type {ISpellingBee} from '$lib/interfaces'
   import {search, isUpper, isLower} from '$lib/utils/thaiwords'
   import {flip} from 'svelte/animate'

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
      if(answer.length == 0)
         return

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

      if(answer.split("").some(l => !letters.includes(l))) {
         logs = [{
            answer, response: 'illegal'
         }, ...logs]
         answer = ''
         return
      }

      if (!search(answer)) {
         logs = [{
            answer, response: 'wordless'
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

   function newPuzzle() {
      content = getRandomPuzzle()
      letters = shuffle(content.letters)
      pangram = content.pangram
      solutions = content.solutions.filter(s => s.length >= 3)
      solved = new Array(solutions.length).fill(false)

      pastAnswers = []
      goto(`/puzzles/spellingbee?id=${content.id}`, {replaceState: true})
   }

   function addLetter(l: string) {
      answer += l
   }
</script>

<div class="flex flex-col gap-2 lg:h-auto relative">
   <div class="sticky flex flex-col top-20 z-20 bg-success-content">
      <div class="flex flex-row flex-wrap gap-2 align-center w-full justify-center p-4">
         {#each letters as l (l)}
            <div class="border-2 w-20 h-20 btn btn-outline" on:click={()=>addLetter(l)} animate:flip={{duration:300}}>
               <p class="text-6xl" class:translate-x-4={isUpper(l) || isLower(l)}>{l}</p>
            </div>
         {/each}
      </div>

      <div class="flex flex-row flex-wrap justify-center my-2 gap-4 w-full px-4">
         <div class="input-group w-80">
            <div class="btn btn-warning" on:click={()=>letters = shuffle(letters)}>สลับ</div>
            <input class="input input-bordered text-3xl w-48" type="text" bind:value={answer} on:keydown={handleKeyPress}>
            <div class="btn btn-primary" on:click={checkAnswer}>ส่ง</div>
         </div>
         <div class="btn btn-error" on:click={giveUp}>เปิดเฉลย</div>
         <div class="btn btn-info" on:click={newPuzzle}>สุ่มข้อใหม่</div>
      </div>
   </div>

   <div class="flex flex-col lg:flex-row w-full items-start text-center">
      <div class="w-full lg:w-1/2">
         <h2>คำตอบก่อนหน้านี้</h2>
         <div class="flex flex-col gap-2 content-start h-20 lg:h-60 overflow-y-scroll"> 
            {#each logs as l}
               {#if l.response === 'correct'}
                  <p class="text-success">{l.answer} ✔️</p>
               {:else if l.response === 'duplciate'}
                  <p class="text-warning">{l.answer} เคยตอบไปแล้ว</p> 
               {:else if l.response === 'illegal'}
                  <p class="text-error">{l.answer} ❌ มีตัวอักษรที่ห้ามใช้</p>
               {:else if l.response === 'wordless'}
                  <p class="text-error">{l.answer} ❌ ไม่อยู่ในพจนานุกรม</p>
               {:else if l.response === 'short'}
                  <p class="text-error">{l.answer} ❌ สั้นกว่า 3 ตัวอักษร</p> 
               {/if}
            {/each}
         </div>
      </div>

      <div class="w-full lg:w-1/2 mx-auto flex flex-col gap-2">
         <h3>คำตอบที่หาเจอแล้ว (เรียงตามตัวอักษร)</h3>
         <div class="grid grid-cols-3 lg:grid-cols-4 gap-2 p-2"> 
            {#each solutions as s, idx}
               <div 
                  class="border-2 border-neutral-content transition-colors duration-500" 
                  class:bg-neutral-content={!solved[idx]}
                  class:border-success={s.length == 7}
                  on:click={()=>solved[idx] = true}
               >
                  {#if solved[idx]}
                     <p class="text-neutral-content">{s}</p>
                  {:else}
                     <p class="text-neutral"> {s.length}</p>
                  {/if}
               </div>
            {/each}
         </div>
         <p class="text-xs text-info">(คลิกในกล่อง เพื่อเปิดเฉลยคำนั้นได้)</p>
      </div>
   </div>

   
</div>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="submit-modal" class="modal-toggle"/>
<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="modal cursor-pointer w-screen" class:modal-open={openModal} on:click={()=>openModal = false}>
   <label class="modal-box relative" for="">
      <h3 class="text-xl font-bold p-2">"คุณหา pangram เจอแล้ว 🎉</h3>
      <div class="btn btn-block btn-outline" on:click={()=>openModal = false}>เย่!</div>
   </label>
</label>