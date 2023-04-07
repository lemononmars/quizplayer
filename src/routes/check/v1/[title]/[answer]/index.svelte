<script lang=ts>
   import {encode, decode} from '../../../helper'

   function checkAnswer(){
      loading = true
      lastSubmission = submission
      correct = (encode(submission) === answer)
      setTimeout(()=> loading = false, 500) // wait 1 seconds before revealing
   }

   export let title: string, answer: string
   title = decode(title)

   let submission:string = ''
   let lastSubmission:string = ''
   let correct:boolean = false
   let loading:boolean = false
</script>

<svelte:head>
   <title>ตรวจคำตอบ</title>
</svelte:head>

<div class="flex flex-col gap-2 h-full lg:h-auto relative overflow-y-clip lg:overflow-y-none">
   <h1>{title}</h1>
   <div class="">ใส่คำตอบ</div>
   <input class="input input-bordered text-3xl transition-colors" type="text" bind:value={submission}>
   <div class="btn btn-primary w-48 m-auto" on:click={checkAnswer}>ตรวจ</div>

   <div class="text-center">
      {#if lastSubmission.length > 0}
         {#if loading}
            <p class="text-warning">กำลังตรวจคำตอบ...</p>
         {:else}
            {#if correct}
               <p class="text-success">{lastSubmission} ✔️ เป็นคำตอบที่ถูกต้อง</p>
            {:else}
               <p class="text-error">{lastSubmission} ❌ ยังไม่ถูก</p> 
            {/if}
         {/if}
      {/if}
   </div>
</div>