<script lang=ts>
import { goto } from '$app/navigation';

   import {adventureCode, adventureLevel} from '$lib/store'
   import {onMount} from 'svelte'

   let level: number = parseInt($adventureLevel)
   let code: string = $adventureCode
   let status: string = ''

   let content: any

   async function getLevel(code: string) {
      const res = await fetch(`/api/puzzle/adventure/${level}/get/${code}`)
      const data = await res.json()

      if(data.result === 'correct')
         return data
      else
         return {}
   }

   onMount(async() => {
      content = await getLevel(code)
   })

   let answer: string = ''
   let solved: boolean = false
   
   async function checkAnswer() {
      const res = await fetch(`/api/puzzle/adventure/${level}/check/${answer}`)
      const data = await res.json()

      if(data) {
         if(data.result === 'correct') {
            solved = true
            status = 'correct!' + data.code
            $adventureCode = data.code
            $adventureLevel = String(level + 1)
            goto(`/puzzles/adventure/${level + 1}`)
         }
         else {
            status = 'incorrect' + data.hint
         }
      }
      else 
         status = 'server error'
   }

   function handleKeyPress(event: KeyboardEvent) {
		if (event.code != "Enter") return;
		checkAnswer()
	}
</script>

{#if content && content.result === 'correct'}
   <h1>Level {level}</h1>

   <div class="w-full p-4 my-20 bg-success-content">
      {content.question}
   </div>

   <div class="input-group w-72 mx-auto">
      <input class="input input-bordered" type="text" bind:value={answer} on:keydown={handleKeyPress}>
      <div class="btn btn-primary " on:click={checkAnswer}>ตรวจคำตอบ</div>
   </div>
{:else}
   <div class="btn loading">Loading ... </div>
{/if}

{status}