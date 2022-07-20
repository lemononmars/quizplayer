<script lang=ts>
   import type {IPuzzleHunt} from '$lib/interfaces'
   export let content: IPuzzleHunt

   let {title, puzzles, id} = content

   let currentTab: number = 0
   const numPuzzles: number = content.puzzles.length
   let solved: boolean[] = Array(numPuzzles).fill(false)
   $: currentPuzzle = content.puzzles[currentTab]

   let answer: string = ''
   interface submissionResponse {
      answer?: string,
      result?: 'correct' | 'incorrect',
      hint?: string
   }
   let submissionResponse: submissionResponse | null

   async function checkAnswer() {
      if(!answer) return

      let isCorrect: boolean = false
      let hint: string = ''
      const sol = content.puzzles[currentTab].solution
      if(sol && answer.toUpperCase() == sol) {
         isCorrect = true
      }
      else if(!sol) {
         const res = await fetch(`/api/puzzle/puzzlehunt/${puzzles[currentTab].index}`, {
            method: 'POST',
            cache: 'default',
            credentials: 'same-origin',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               index: currentTab,
               answer
            })
         })
         const response = await res.json()

         if(response.result === 'correct')
            isCorrect = true
         else
            hint = response.hint
      }

      if(isCorrect) {
         submissionResponse = {answer, result: 'correct'}
         solved[currentTab] = true
      }
      else
         submissionResponse = {answer, result: 'incorrect', hint}

      answer = ''
   }

   function changeTab(n: number) {
      currentTab = n
      answer = ''
      submissionResponse = null
   }
</script>

<div class="flex flex-col gap-2 justify-content">
   <h1>{title}</h1>
   <div class="divider"></div>
   <div class="tabs w-full justify-around">
      {#each puzzles as p, idx}
         <!-- svelte-ignore a11y-missing-attribute -->
         <a class="tab tab-bordered" 
            class:tab-active={currentTab == idx} 
            on:click={()=>changeTab(idx)}
         >
            ข้อที่ {p.index} {solved[idx]? '✔️':''}
         </a>
      {/each}
   </div>
   <div class="flex flex-col gap-2 justify-content">
      <h2>ข้อที่ {currentPuzzle.index} - {currentPuzzle.title}</h2>
      <div class="mx-auto">
         <div class="input-group">
            <input type="text" class="input input-bordered" bind:value={answer}>
            <div class="btn btn-primary" on:click={checkAnswer}>ตรวจคำตอบ</div>
         </div>
         {#if submissionResponse}
            <p>{submissionResponse.result} {submissionResponse.hint || ''}</p>
         {/if}
      </div>
      <iframe src="{currentPuzzle.file}/preview" width="600" height="800" title="file" class="mx-auto max-h-screen"/>
      <div class="divider"></div>
      <h3>คำใบ้</h3>
      {#each currentPuzzle.hints as h, idx}
         <div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
            <div class="collapse-title text-xl text-info">
               คำใบ้ที่ {idx + 1}
            </div>
            <div class="collapse-content"> 
            <p>{h}</p>
            </div>
         </div>
      {:else}
         <h3>ไม่มีคำใบ้</h3>
      {/each}
   </div>
</div>