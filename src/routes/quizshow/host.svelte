<script lang=ts>
   import {onMount, onDestroy} from 'svelte'
   import {fade} from 'svelte/transition'
   import {LockIcon, UnlockIcon, CheckCircleIcon, XCircleIcon, Volume2Icon, VolumeXIcon, RefreshCwIcon} from 'svelte-feather-icons'
   import {loadSounds, type soundType} from '$lib/sounds'
   import { createClient } from '@supabase/supabase-js'
   const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

   const channel = supabase.channel('quiz')

   interface PlayerInfo {
      username: string,
      ID: number,
      color: number,
      score: number
   }

   let sounds: any = {}
   let soundOn: boolean = true
   const colors:string[] = ['primary', 'accent', 'info' , 'error']
   let logs: string[] = []
   let answerQueue: string[] = []
   let isLocked: boolean = false
   let isDouble: boolean = false

   let round: number = 1
   const scoreList: number[] = [100, 200, 300, 400, 500]
   let score: number = 0
   $: totalScore = scoreList[score]*round
   let playerList: PlayerInfo[] = []

   onMount(async()=>{
      sounds = loadSounds()
      channel.on('broadcast',{ event: 
         'pushButton' },
         (payload) => {
            const u = payload.payload.username
            answerQueue = [...answerQueue, u]

            channel.send({type:'broadcast', event: 
               'updateQueue',
               payload: {username: u}
            })
         }
      )

      channel.on('broadcast',{ event: 
         'submitWager' },
         (payload) => {
            console.log('wager received!', isDouble, round)
            if(!isDouble && round < 3) return

            const {username, wager} = payload.payload
            answerQueue = [...answerQueue, username + ': $' + wager]

            channel.send({type:'broadcast', event: 
               'updateQueue',
               payload: {username: username + ': $' + wager}
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
            const leftPlayerUsername = payload.payload.username
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
      playSound('timesup')
      answerQueue = []
      channel.send({
         type: 'broadcast',
         event: 'resetButton',
         payload: {}
      })
   }

   function correctAnswer() {
      if(answerQueue.length == 0) return
      playSound('correct')
      const i = answerQueue[0].indexOf('$')
      const s = i >= 0?
         parseInt(answerQueue[0].slice(i+1)): 
         totalScore
      const u = i >= 0?
         answerQueue[0].slice(0, answerQueue[0].indexOf(':')):
         answerQueue[0]
      updateScore(s, u)
      resetButton()
   }

   function wrongAnswer() {
      if(answerQueue.length == 0) return
      playSound('incorrect')
      const current = answerQueue.shift() || ''
      const i = current.indexOf('$')
      const s = i >= 0?
         parseInt(current.slice(i+1)): 
         totalScore
      const u = i >= 0? 
         current.slice(0, current.indexOf(':')):
         current
      updateScore(-s, u)
      
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
      const timestamp = new Date().toLocaleTimeString()
      logs = [...logs, timestamp + ' - ' + message]
   }

   function pass() {
      updateScore(0, answerQueue.shift() || '')
   }

   function dailyDouble() {
      if(!isDouble)
         playSound('double')
   }

   function playSound(option: soundType) {
      if(!soundOn) return

      switch (option) {
         case 'ping': sounds.ping.play(); break;
         case 'correct': sounds.correct.play(); break;
         case 'incorrect': sounds.incorrect.play(); break;
         case 'timesup': sounds.timesup.play(); break;
         case 'double': sounds.double.play(); break;
         default: break;
      }
   }

   onDestroy(()=>{
      supabase.removeChannel(channel)
   })
</script>

<div class="flex flex-col items-center gap-y-2 my-10 w-full">

   <button class="btn btn-sm btn-circle btn-outline" on:click={()=>soundOn = !soundOn}>
      {#if soundOn}
         <Volume2Icon size=20 class="text-success"/>
      {:else}
         <VolumeXIcon size=20 class="text-error"/>
      {/if}
   </button>

   <div class="btn-group">
      <div class="btn w-40 text-xl btn-error" class:btn-outline={!isLocked} on:click={toggleLockButton} on:keypress={()=>{}}>
         {#if isLocked}
            <LockIcon size=30/>
         {:else}
            <UnlockIcon size=30/>
         {/if}
      </div>
      <div class="btn w-40 text-xl btn-outline btn-accent" on:click={resetButton} on:keypress={()=>{}}>
         <RefreshCwIcon size = 30/>
      </div>
   </div>
   <div class="btn-group">
      <button class="btn btn-outline" class:btn-active={round === 1} on:click={()=>round = 1}>Round 1</button>
      <button class="btn btn-outline" class:btn-active={round === 2} on:click={()=>round = 2}>Round 2</button>
      <button class="btn btn-outline" class:btn-active={round === 3} on:click={()=>round = 3}>Final</button>
   </div>

   <div>
      {#if round < 3}
         <div class="btn-group">
            {#each scoreList as s, index}
               <button class="btn" class:btn-info={index == score} class:btn-outline={index != score} on:click={()=>score = index}>{s*round}</button>
            {/each}
         </div>

         <div class="form-control">
            <label class="label cursor-pointer w-36 m-auto">
               <span class="label-text">Double</span> 
               <input type="checkbox" class="toggle" bind:checked={isDouble} on:click={dailyDouble}/>
            </label>
         </div>
      {/if}
   </div>

   <div class="flex flex-row gap-2 h-20 items-center bg-slate-800 w-full">
      {#each playerList as p}
         <div class="btn-group mx-2">
            <div 
               class="btn btn-{colors[p.color]}" 
               on:click={()=>answerQueue = [...answerQueue, p.username]}
               on:keypress={()=>{}}
            >{p.username}</div> 
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
         <ol>
            {#each answerQueue as a, index}
               <li class:text-3xl={index == 0}>{a}</li>
            {/each}
         </ol>
      </div>
   {/if}
</div>



<h3>Logs</h3>
<div class="max-h-60 overflow-y-scroll">
<ul>
   {#each logs.reverse() as l}
      <li transition:fade>{l}</li>
   {/each}
</ul>
</div>