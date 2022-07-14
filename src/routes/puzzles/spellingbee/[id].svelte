<script lang=ts>
   import { goto } from '$app/navigation';

   import type {ISpellingBee} from '$lib/interfaces'
   import { getRandomPuzzle } from '$lib/data/puzzles/spellingbee';
   import {search, isUpper, isLower, getSubWords} from '$lib/utils/thaiwords'
   import {XCircleIcon} from 'svelte-feather-icons'

   import {fly} from 'svelte/transition'
   import {flip} from 'svelte/animate'

   export let content: ISpellingBee

   let answer: string = ''
   let pastAnswers: string[] = []
   interface SubmissionLog {
      answer: string
      response: string
   }
   let logs: SubmissionLog[] = []

   let solutions: string[] = getSubWords(content.word, false)
   let letters = content.word.split("")
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
         triggleWiggle()
         answer = ''
         return
      }

      if(answer.length < 3) {
         logs = [{
            answer, response: 'short'
         }, ...logs]
         triggleWiggle()
         answer = ''
         return
      }

      if(answer.split("").some(l => !letters.includes(l))) {
         logs = [{
            answer, response: 'illegal'
         }, ...logs]
         triggleWiggle()
         answer = ''
         return
      }

      if (!search(answer)) {
         logs = [{
            answer, response: 'wordless'
         }, ...logs]
         triggleWiggle()
         answer = ''
         return
      }

      pastAnswers = [...pastAnswers, answer]
      if(solutions.includes(answer)) {
         solved[solutions.indexOf(answer)] = true
         logs = [{
            answer, response: 'correct'
         }, ...logs]
         triggerFlash()
      }

      if(answer.length == content.word.length) {
         openModal = true
      }

      answer = ''
   }

   function handleKeyPress(event: KeyboardEvent) {
		if (event.code != "Enter") return;
      if(openModal) openModal = false
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
      let {id, word} = getRandomPuzzle()
      solutions = getSubWords(word, false)
         .filter(s => s.length >= 3)
      
      letters = word.split("")
      letters = shuffle(letters)
      
      solved = new Array(solutions.length).fill(false)
      logs = []

      pastAnswers = []
      goto(`/puzzles/spellingbee/${id}`, {replaceState: true})
   }

   function addLetter(l: string) {
      if(!answer.includes(l))
         answer += l
      else if(answer[answer.length-1] === l)
         answer = answer.slice(0, answer.length - 1)
   }

   let isWiggle: boolean = false
   let isFlashing: boolean = false

   function triggleWiggle() {
      isWiggle = true
      setTimeout(()=>isWiggle=false, 1000)
   }

   function triggerFlash() {
      isFlashing = true
      setTimeout(()=>isFlashing=false, 200)
   }
</script>

<svelte:body on:keypress={handleKeyPress}/>

<div class="flex flex-col gap-2 h-full lg:h-auto relative overflow-y-clip lg:overflow-y-none">
   <div class="sticky top-0 lg:top-20 flex flex-col z-20 bg-info-content h-1/2 lg:h-auto">
      <div class="flex flex-row flex-wrap gap-2 align-center w-full justify-center p-4">
         {#each letters as l, idx (l)}
            <div 
               class="border-2 w-20 h-20 btn btn-outline transition-transform" 
               class:btn-primary={answer.includes(l)}
               class:scale-90={answer.includes(l)}
               on:click={()=>addLetter(l)} 
               in:fly={{y:10, delay:idx*300}}
               animate:flip={{duration:500}}
            >
               <p class="text-6xl" class:translate-x-4={isUpper(l) || isLower(l)}
                  class:translate-y-3={!isLower(l)}
               >{l}</p>
            </div>
         {/each}
      </div>

      <div class="flex flex-row flex-wrap justify-center my-2 gap-4 w-full px-4">
         <div class="input-group w-80" class:wiggle={isWiggle}>
            <div class="btn btn-warning" on:click={()=>letters = shuffle(letters)}>สลับ</div>
            <input class="input input-bordered text-3xl w-48 transition-colors" type="text" bind:value={answer} class:bg-primary={isFlashing}>
            <div class="-translate-x-8 w-0 my-auto" class:hidden={answer === ''} on:click={()=>answer = ''}>
               <XCircleIcon size=20/>
            </div>
            <div class="btn btn-primary" on:click={checkAnswer}>ส่ง</div>
         </div>
         <div class="btn btn-error" on:click={giveUp}>เปิดเฉลย</div>
         <div class="btn btn-info" on:click={newPuzzle}>สุ่มข้อใหม่</div>
      </div>
   </div>

   <div class="flex flex-col lg:flex-row w-full items-start text-center">
      <div class="w-full lg:w-1/2 h-40 lg:h-80 relative">
         <h2 class="sticky top-0">คำตอบก่อนหน้านี้</h2>
         <div class="flex flex-col gap-2 content-start h-full overflow-y-scroll"> 
            {#each logs as l}
               {#if l.response === 'correct'}
                  <p class="text-success">{l.answer} ✔️</p>
               {:else if l.response === 'duplicate'}
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

      <div class="divider"></div>

      <div class="w-full lg:w-1/2 h-1/3 lg:h-80 mx-auto flex flex-col gap-2">
         <h3>คำที่หาเจอแล้ว (เรียงตามตัวอักษร)</h3>
         <div class="grid grid-cols-3 lg:grid-cols-4 gap-2 p-2 overflow-y-scroll"> 
            <p class="text-base lg:text-xs text-info col-span-full">(คลิกในกล่อง เพื่อเปิดเฉลยคำนั้นได้)</p>
            {#each solutions as s, idx}
               <div 
                  class="border-2 border-neutral-content transition-colors duration-500 h-8" 
                  class:bg-neutral-content={!solved[idx]}
                  on:click={()=>solved[idx] = true}
               >
                  {#if solved[idx]}
                     <p class="text-neutral-content">{s}</p>
                  {:else}
                     <p class="text-neutral" class:bg-primary={s.length == 7}>{s.length}</p>
                  {/if}
               </div>
            {/each}
         </div>
      </div>
   </div>

   
</div>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="submit-modal" class="modal-toggle"/>
<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="modal cursor-pointer w-screen" class:modal-open={openModal} on:click={()=>openModal = false}>
   <label class="modal-box relative" for="">
      <h3 class="text-xl font-bold p-2">"ใช้ตัวอักษรครบแล้ว 🎉</h3>
      <div class="btn btn-block btn-outline" on:click={()=>openModal = false}>เย่!</div>
   </label>
</label>


<style>
	@keyframes pos-x-wiggle {
		0% {
			transform: translateX(0px);
		}
		20% {
			transform: translateX(10px);
		}
		40% {
			transform: translateX(-10px);
		}
		60% {
			transform: translateX(5px);
		}
		80% {
			transform: translateX(-5px);
		}
		100% {
			transform: translateX(0px);
		}
	}
	.wiggle {
		animation-duration: 0.5s;
		animation-fill-mode: both;
		animation-name: pos-x-wiggle;
		animation-play-state: running;
	}
</style>