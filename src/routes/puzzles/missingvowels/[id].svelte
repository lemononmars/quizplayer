<script lang=ts>
   import type {IMissingVowels} from '$lib/interfaces'
   import {XCircleIcon, PlayCircleIcon} from 'svelte-feather-icons'

   import TitleTab from '$lib/components/TitleTab.svelte';
   import {fly} from 'svelte/transition'

   export let content: IMissingVowels

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

   
   let time: number = 0
   $: timeString = (time < 60000 ? '' : Math.floor(time/60000) + ' นาที ') + (Math.floor(time/1000) % 60) + ' วินาที'
   let timer: string|number|NodeJS.Timeout|undefined
   let isPlaying: boolean = false
   let isFinished: boolean = false

   function play() {
      isPlaying = true
      timer = setInterval(()=>time += 100, 100)
   }

   let openModal: boolean = false

   function stripVowels(w: string){
      let naked = w.replace(/[^\u0E00-\u0E2E]/g, '')
      let shuffle = naked.split("").reduce(
         (w,c)=>w+c+ (Math.random()<0.7?'':' '),
         ''
      )
      return shuffle
   }

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
         clearInterval(timer)
         isFinished = true
      }
      else {
         currentRound ++
         submitted = false
         solved = false
      }
   }

   function handleKeyPress(event: KeyboardEvent) {
		if (event.code != "Enter") return;
		checkAnswer()
	}

   function focusOnMount(node) {
		node.focus();
	}
</script>

<TitleTab {content}/>

<div class="flex flex-col gap-2 pb-10">

   {#if isPlaying}
      <div>{timeString}</div>
      {#each content.answers as a, idx}
         {#if currentRound >= idx}
            <div>
               {idx + 1} / {numRounds}
            </div>
            <div transition:fly={{x:100, duration: 300}}>
               <div class="text-3xl {currentRound === idx && !isFinished? 'text-info-content bg-info':'text-success-content bg-success'} p-4">
                  {stripVowels(a)}
               </div>
            </div>
            {#if currentRound != idx || isFinished}
               <div class="text-2xl text-primary-content bg-primary">
                  {a}
               </div>
            {:else}
               <div class="input-group w-72 mx-auto">
                  <input class="input input-bordered" type="text" bind:value={answer} on:keydown={handleKeyPress} use:focusOnMount>
                  <div class="btn btn-primary " on:click={checkAnswer}>ตอบ</div>
               </div>
            {/if}
         {/if}
      {/each}
   {:else}
      <div class="btn btn-primary btn-xl btn-wide h-20 mx-auto m-4 text-3xl gap-4" on:click={play}>
         เริ่ม <PlayCircleIcon size=40/>
      </div>
   {/if}

   <div class="divider"></div>
</div>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="submit-modal" class="modal-toggle"/>
<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="modal cursor-pointer w-screen" class:modal-open={openModal} on:click={()=>openModal = false}>
   <label class="modal-box relative" for="">
      <h3 class="text-xl font-bold m-2">คุณแก้ปริศนาครบทั้ง {numRounds} ข้อแล้ว 🎉</h3>
      <p>ใช้เวลาทั้งหมด {timeString}</p>
      <div class="btn btn-block btn-outline" on:click={()=>openModal = false}>เย่!</div>
   </label>
</label>