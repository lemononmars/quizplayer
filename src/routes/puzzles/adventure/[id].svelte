<script context=module lang=ts>
   import {adventureProgress} from '$lib/store'
   export async function load({fetch, params}) {
      const {id} = params
      const progress = adventureProgress

      return {
         props:{
            level: 1
         }
      }
   }
</script>

<script lang=ts>
   export let level: number

   async function getLevel(l: number, code: string) {
      const res = await fetch(`/api/puzzle/adventure/${l}/${code}`)
      const data = await res.json()

      if(data.ok)
         return data.level
   }

   let answer: string = ''
   let solved: boolean = false
   
   async function checkAnswer() {
      const res = await fetch(`/api/puzzle/adventure/${level}/${answer}`)
      const data = await res.json()

      if(data.ok) {
         if(data.result === 'correct')
            solved = true
      }
   }

   function handleKeyPress(event: KeyboardEvent) {
		if (event.code != "Enter") return;
		checkAnswer()
	}
</script>

<h1>Level {level}</h1>

<div class="w-full p-4 my-20 bg-success-content">
1+1 = ?
</div>

<div class="input-group w-72 mx-auto">
   <input class="input input-bordered" type="text" bind:value={answer} on:keydown={handleKeyPress}>
   <div class="btn btn-primary " on:click={checkAnswer}>ตรวจคำตอบ</div>
</div>