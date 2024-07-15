<script lang=ts>
   import {username} from '$lib/store'
   import {XCircleIcon, KeyIcon, Link2Icon} from 'svelte-feather-icons'
   // import { Leaderboard } from '$lib/interfaces'
   export let year: number, week: number

   let answer: string = ''
   let logs: string[] = []
   let openModal: boolean = false
   let isFinished: boolean = false

   function triggleWiggle() {
      isWiggle = true
      setTimeout(()=>isWiggle=false, 1000)
   }
   let isWiggle: boolean = false

   function handleKeyPress(event: KeyboardEvent) {
		if (event.code != "Enter") return;
      if(openModal) openModal = false
		checkAnswer()
   }

   let isSubmitting: boolean = false

   async function checkAnswer() {
      isSubmitting = true
      if(answer.length == 0)
         return

      const res = await fetch(`/api/puzzle/weekly/${year}/${week}/${answer}`)
      const data = await res.json()

      if(data) {
         if(data.result) {
            openModal = true;
         }
         else {
            triggleWiggle()
            logs = [answer, ...logs]
            answer = ''
         }
      }
      
      isSubmitting = false
   }

   async function addToLeaderboard() {
      // check your answer again, just in case 0_0
      let res = await fetch(`/api/puzzle/weekly/${year}/${week}/${answer}`)
      let data = await res.json()

      if(data) {
         if(!data.result) {
            return
         }
      }

      isSubmitting = true
		await fetch('/api/post/leaderboard', {
         method: 'POST',
         cache: 'default',
         credentials: 'same-origin',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
				puzzle_type: 'weekly',
            puzzle_id: year + week,
            name: $username,
            score: 5
			})
      })
      isSubmitting = false
      openModal = false
      isFinished = true
	}
</script>

<svelte:body on:keypress={handleKeyPress}/>

<div class="flex flex-col gap-2 h-full lg:h-auto relative overflow-y-clip lg:overflow-y-none">
   <div class="sticky top-0 lg:top-20 flex flex-col z-20 bg-info-content h-1/2 lg:h-auto">
      <h1>ปริศนาสัปดาห์ที่ {week} ปี {year}</h1>
      {#if !isFinished}
         <div class="flex flex-row flex-wrap justify-center my-2 gap-4 w-full px-4">
            <div class="input-group w-80" class:wiggle={isWiggle}>
               <div class="btn btn-accent no-animation"><KeyIcon size=20/></div>
               <input class="input input-bordered text-3xl w-48 transition-colors" type="text" bind:value={answer}>
               <div class="-translate-x-8 w-0 my-auto" class:hidden={answer === ''} on:click={()=>answer = ''}>
                  <XCircleIcon size=20/>
               </div>
               <div class="btn btn-primary" class:loading={isSubmitting} on:click={checkAnswer}>ส่ง</div>
            </div>
         </div>
      {:else}
         <h2>คุณแก้ปริศนาได้แล้ว! ดูตารางอันดับได้ที่นี่</h2>
         <a class="button" href="/puzzles/weekly/{year}/{week}/leaderboard">
            <Link2Icon size=20/>
         </a>
      {/if}
   </div>

   <div class="flex flex-col w-full h-auto  items-start justify-center">
      <h2 class="sticky top-0 w-full">คำตอบที่ตอบไปแล้ว</h2>
      <div class="flex flex-col gap-2 content-start w-full"> 
         {#each logs as l}
            <p class="text-success">{l}</p>
         {:else}
            <p>-</p>
         {/each}
      </div>
   </div>
</div>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="submit-modal" class="modal-toggle"/>
<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="modal cursor-pointer w-screen" class:modal-open={openModal}>
   <label class="modal-box relative" for="">
      <h3 class="text-xl font-bold p-2">ถูกต้องนะครับ 🎉</h3>
      <div class="divider"></div>
      <div class="my-4">
         <p>กรอกชื่อเพื่อบันทึกคะแนน</p>
         <input type="text" class="input input-bordered" bind:value={$username}>
      </div>
      <div class="flex flex-row justify-center gap-4">
         <div class="btn btn-wide btn-outline btn-success" on:click={addToLeaderboard} class:loading={isSubmitting}>บันทึก</div>
         <div class="btn btn-outline btn-error" on:click={()=>openModal = false} >ปิด</div>
      </div>
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