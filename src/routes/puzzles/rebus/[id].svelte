<script context=module lang=ts>
   export async function load({fetch, params}) {
      const {id} = params
      const res = await fetch(`/api/puzzle/rebus/${id}`)
      const content = await res.json()

      return {
         props: {
            content, id
         }
      }
   }
</script>

<script lang=ts>
   import type {IRebus} from '$lib/interfaces'
   import TitleTab from '$lib/components/TitleTab.svelte';
   import { getPuzzleImageURL } from '$lib/supabase';
   export let content: IRebus, id: number

   let solved: boolean = false
   let submitted: boolean = false

   let answer: string = ''
   let duplicate: boolean = false
   let showAnswer: boolean = false
   let pastAnswers: string[] = []

   $: length = pastAnswers.length
   let numHints: number = 0
   const imgurl = "rebus" + ("0" + id).slice(-2) + ".png"

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
      if(answer === content.answer) {
         solved = true
         openModal = true
      }
      answer = ''
   }

   function handleKeyPress(event: KeyboardEvent) {
		if (event.code != "Enter") return;
		checkAnswer()
	}

   function revealHint(){
      if(content.hints && numHints < content.hints?.length)
         numHints ++
      scrollBottom()
   }

   function scrollBottom() {
		window.scroll({ top: window.innerHeight + 200, behavior: 'smooth' });
	}
</script>

<div class="flex flex-col gap-2 pb-10">
   <TitleTab {content}/>

   <div class="mx-auto w-full lg:w-1/2">
      <img src="{getPuzzleImageURL('rebus', imgurl)}" onerror='this.style.display = "none"' class="aspect-auto object-contain" alt="img">
   </div>
   <h3>ภาพนี้แสดงคำว่าอะไร?</h3>

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

   <div class="divider"></div>

   {#if content.hints}
      <div class="w-full lg:w-1/2 mx-auto">
         <h1>คำใบ้</h1>
         {#each content.hints?.slice(0,numHints) as h, idx}
            <div class="btn btn-outline btn-info">คำใบ้ที่ {idx+1}</div> <p>{h}</p>
         {/each}
         {#if numHints < content.hints.length}
            <div class="btn btn-outline" on:click={revealHint}>เปิดคำใบ้ที่ {numHints + 1}</div>
         {:else}
            <div class="btn btn-warning" on:click={()=>{showAnswer = true; scrollBottom()}}>เฉลย</div>
            {#if showAnswer}
               <p>{content.answer}</p>
            {/if}
         {/if}
      </div>
   {/if}
</div>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="submit-modal" class="modal-toggle"/>
<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="modal cursor-pointer w-screen" class:modal-open={openModal} on:click={()=>openModal = false}>
   <label class="modal-box relative" for="">
      <h3 class="text-xl font-bold m-2">"{content.answer}" เป็นคำตอบที่ถูกต้อง! 🎉</h3>
      <div class="btn btn-block btn-outline" on:click={()=>openModal = false}>เย่!</div>
   </label>
</label>