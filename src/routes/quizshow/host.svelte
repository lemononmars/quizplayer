<script lang=ts>
   import {onMount, onDestroy} from 'svelte'
   import {LockIcon, UnlockIcon, CheckCircleIcon, XCircleIcon} from 'svelte-feather-icons'
   import {soundType, loadSounds} from '$lib/sounds'
   import { createClient } from '@supabase/supabase-js'
   const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

   const channel = supabase.channel('quiz')

   interface PlayerInfo {
      username: string,
      ID: number,
      color: number,
      score: number
   }

   let host: boolean = true
   let sounds: any = {}
   let logs: string[] = []
   let answerQueue: string[] = []
   let isLocked: boolean = false
   let isDouble: boolean = false

   let round: number = 1
   const scoreList: number[] = [100, 200, 300, 400, 500]
   let score: number = 0
   $: totalScore = scoreList[score]*round*(isDouble? 2:1)
   let playerList: PlayerInfo[] = []

   onMount(()=>{
      sounds = loadSounds()
      channel.on(
         'broadcast',
         { event: 'pushButton' },
         (payload) => {
            const u = payload.payload.username
            answerQueue.push(u) 
            answerQueue = answerQueue

            channel.send({type:'broadcast', event: 
               'updateQueue',
               payload: {username: u}
            })
         }
      )

      channel.on('broadcast',{ event: 
         'playerJoin' },
         (payload) => {
            const newUsername = payload.payload.info.username
            const dupe = playerList.some(p=>p.username == newUsername)
            if(dupe) return

            playerList.push(payload.payload.info)
            playerList = playerList
            addLog(newUsername + ' joined')

            channel.send({
               type: 'broadcast',
               event: 'sharePlayerList',
               payload: {playerList}
            })
         }
      )

      channel.on('broadcast',{ event: 
         'playerLeave' },
         (payload) => {
            const leftPlayerUsername = payload.payload.ID
            playerList = playerList.filter(p => p !== leftPlayerUsername)
            playerList = playerList
            addLog(leftPlayerUsername + ' left')
         }
      )


      channel.subscribe((status) => {
         if (status !== 'SUBSCRIBED') return null
      })
   })

   function toggleLockButton(){
      isLocked = !isLocked
      channel.send({
         type: 'broadcast',
         event: 'toggleLockButton',
         payload: {}
      })
   }

   function resetButton(){
      sounds.timesup.play()
      answerQueue = []
      channel.send({
         type: 'broadcast',
         event: 'resetButton',
         payload: {}
      })
   }

   function correctAnswer() {
      if(answerQueue.length == 0) return
      sounds.correct.play()
      updateScore(totalScore, answerQueue[0])
      resetButton()
   }

   function wrongAnswer() {
      if(answerQueue.length == 0) return
      sounds.incorrect.play()
      updateScore(-totalScore, answerQueue.shift() || '')
      answerQueue = answerQueue
   }

   function updateScore(s: number, username: string) {

      channel.send({
         type: 'broadcast',
         event: 'updateScore',
         payload: { score: s, username },
      })
      addLog(username + ' gets ' + s + ' points')
      playerList.forEach(p => {
         if(p.username === username) p.score += s
      })
      playerList = playerList
   }

   function addLog(message: string) {
      logs.push(message)
      logs = logs
   }

   function pass() {
      updateScore(0, answerQueue.shift() || '')
   }

   function dailyDouble() {
      if(!isDouble)
         sounds.double.play()
   }

   onDestroy(()=>{
      supabase.removeChannel(channel)
   })
</script>

<div class="flex flex-col items-center gap-y-2 my-10 w-full">
   <div class="btn-group">
      <div class="btn w-40 text-xl btn-error" class:btn-outline={!isLocked} on:click={toggleLockButton}>
         {#if isLocked}
            <LockIcon size=30/>
         {:else}
            <UnlockIcon size=30/>
         {/if}
      </div>
      <div class="btn w-40 text-xl btn-outline btn-accent" on:click={resetButton}>Reset</div>
   </div>
   <div class="btn-group">
      <button class="btn btn-outline" class:btn-active={round === 1} on:click={()=>round = 1}>Round 1</button>
      <button class="btn btn-outline" class:btn-active={round === 2} on:click={()=>round = 2}>Round 2</button>
      <button class="btn btn-outline" class:btn-active={round === 3} on:click={()=>round = 3}>Final</button>
   </div>

   <div>
      <div class="btn-group">
         {#each scoreList as s, index}
            <button class="btn" class:btn-info={index == score} class:btn-outline={index != score} on:click={()=>score = index}>{s*round*(isDouble? 2:1)}</button>
         {/each}
      </div>

      <div class="form-control">
         <label class="label cursor-pointer w-36 m-auto">
            <span class="label-text">Double</span> 
            <input type="checkbox" class="toggle" bind:checked={isDouble} on:click={dailyDouble}/>
         </label>
      </div>
   </div>

   <div class="flex flex-row gap-2 h-20 items-center bg-slate-800 w-full">
      {#each playerList as p}
         <div class="btn-group mx-2">
            <div class="btn btn-success">{p.username}</div> 
            <div class="btn btn-outline">{p.score}</div>
         </div>
      {/each}
   </div>
   
   {#if answerQueue.length > 0}
      <div class="flex flex-col m-auto">
         <div class="btn-group">
            <button class="btn btn-outline btn-primary" on:click={correctAnswer}>
               <CheckCircleIcon size=30/>
            </button>
            <button class="btn btn-outline btn-error" on:click={wrongAnswer}>
               <XCircleIcon size=30/>
            </button>
            <button class="btn btn-outline btn-warning" on:click={pass}>Pass</button>
         </div>
         <ul>
            {#each answerQueue as a, index}
               <li class:text-3xl={index == 0}>{a}</li>
            {/each}
         </ul>
      </div>
   {/if}
</div>



<h3>Logs</h3>
<div class="max-h-60 overflow-y-scroll">
<ul>
   {#each logs as l}
      <li>{l}</li>
   {/each}
</ul>
</div>