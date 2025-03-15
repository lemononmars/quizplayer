<script lang=ts>
   import {onMount, onDestroy} from 'svelte'
   import {fade} from 'svelte/transition'
   import {LockIcon, UnlockIcon, CheckCircleIcon, XCircleIcon, Volume2Icon, VolumeXIcon, RefreshCwIcon} from 'svelte-feather-icons'
   import {loadSounds, type soundType} from '$lib/sounds'

   import { supabaseClient } from '$lib/supabase'

   const channel = supabaseClient.channel('quiz')

   interface PlayerInfo {
      username: string,
      color: number,
      score: number,
      wager: number,
      answer?: string,
      result?: boolean
   }

   let sounds: any = {}
   let soundOn: boolean = true
   const colors:string[] = ['primary', 'accent', 'info' , 'error']
   let logs: string[] = []
   let answerQueue: string[] = []

   let gameState = {
      round: 1,
      isLocked: false,
      isDouble: false,
      isWagering: false,
      isAnswering: false
   }
   const scoreList: number[] = [200, 400, 600, 800, 1000]
   let score: number = 0
   $: totalScore = scoreList[score]*gameState.round

   let playerList: PlayerInfo[] = []
   let currentDouble: boolean = false

   function getPlayer(username: string) {
      for(var p of playerList)
         if(p.username === username)
            return p
      // bad practice
      return playerList[0]
   }

   onMount(async()=>{
      sounds = loadSounds()
      channel.on('broadcast',{ event: 
         'pushButton' },
         (payload) => {
            updateQueue(payload.payload.username)
         }
      )

      channel.on('broadcast',{ event: 
         'submitWager' },
         (payload) => {
            if(!gameState.isWagering && !gameState.isDouble) return
            
            const {username, wager} = payload.payload.playerInfo
            const p = getPlayer(username)

            p.wager = parseInt(wager)
            playerList = playerList
         }
      )

      channel.on('broadcast',{ event: 
         'submitAnswer' },
         (payload) => {
            if(!gameState.isAnswering) return

            const {username, answer} = payload.payload.playerInfo
            getPlayer(username).answer = answer
            playerList = playerList
         }
      )

      channel.on('broadcast',{ event: 
         'playerJoin' },
         (payload) => {
            const newUsername = payload.payload.info.username
            const dupe = playerList.some(p=>p.username == newUsername)
            if(dupe) return

            playerList = [...playerList, payload.payload.info] 
            addLog(newUsername + ' joined')

            channel.send({
               type: 'broadcast',
               event: 'sharePlayerList',
               payload: {playerList}
            })

            updateGameState()
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
      gameState.isLocked = !gameState.isLocked
      channel.send({
         type: 'broadcast',
         event: 'toggleLockButton',
         payload: {isLocked: gameState.isLocked}
      })
   }

   function resetButton(){
      playSound('timesup')
      answerQueue = []
      gameState.isLocked = true // locked as default
      gameState.isDouble = false
      currentDouble = false
      channel.send({
         type: 'broadcast',
         event: 'resetButton',
         payload: {}
      })
   }

   function correctAnswer() {
      if(answerQueue.length == 0) return
      playSound('correct')
      const p = getPlayer(answerQueue[0])
      const s = p.wager && p.wager > 0 ? p.wager: totalScore
      
      p.wager = 0
      gameState.isDouble = false
      updateScore(s, p.username)
      resetButton()
   }

   function wrongAnswer() {
      if(answerQueue.length == 0) return
      playSound('incorrect')
      const q = answerQueue.shift() || ''
      const p = getPlayer(q)
      const s = (p.wager && p.wager > 0) ? p.wager: totalScore
      // always reset just in case
      p.wager = 0
      updateScore(-s, p.username)
      if(gameState.isDouble)
         resetButton()

      answerQueue = answerQueue
   }

   function updateScore(s: number, username: string) {

      channel.send({
         type: 'broadcast',
         event: 'updateScore',
         payload: { score: s, username },
      })
      addLog((score>0? '✅': score<0? '❌': '') + username + ' gets ' + s + ' points')

      const p = getPlayer(username)
      p.score += s
      p.wager = 0
      p.answer = ''
      playerList = playerList
   }

   function updateQueue(u: string) {
      if(answerQueue.length > 0) return // remove if queueing is allowed
      answerQueue = [...answerQueue, u]

      channel.send({type:'broadcast', event: 
         'updateQueue',
         payload: {username: u}
      })
   }

   function updateRound(r: number) {
      gameState.round = r
      if(r == 3) {
         gameState.isAnswering = true
         gameState.isWagering = true
      }
      else {
         gameState.isAnswering = false
         gameState.isWagering = false
      }
      updateGameState()
   }

   function updateGameState() {
      channel.send({
         type: 'broadcast',
         event: 'updateGameState',
         payload: { gameState },
      })
   }

   function addLog(message: string) {
      const timestamp = new Date().toLocaleTimeString()
      logs = [...logs, timestamp + ' - ' + message]
   }

   function pass() {
      updateScore(0, answerQueue.shift() || '')
   }

   function dailyDouble() {
      if(!currentDouble)
         playSound('double')
      gameState.isDouble = !currentDouble
      updateGameState()
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
      supabaseClient.removeChannel(channel)
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
      <div class="btn w-40 text-xl btn-error" class:btn-outline={!gameState.isLocked} on:click={toggleLockButton} on:keypress={()=>{}}>
         {#if gameState.isLocked}
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
      <button class="btn btn-outline" class:btn-active={gameState.round === 1} on:click={()=>updateRound(1)}>Round 1</button>
      <button class="btn btn-outline" class:btn-active={gameState.round === 2} on:click={()=>updateRound(2)}>Round 2</button>
      <button class="btn btn-outline" class:btn-active={gameState.round === 3} on:click={()=>updateRound(3)}>Final</button>
   </div>

   <div>
      {#if gameState.round < 3}
         <div class="btn-group">
            {#each scoreList as s, index}
               <button class="btn" class:btn-info={index == score} class:btn-outline={index != score} on:click={()=>score = index}>{s*gameState.round}</button>
            {/each}
         </div>

         <div class="form-control">
            <label class="label cursor-pointer w-36 m-auto">
               <span class="label-text" class:text-success={gameState.isDouble}>Double</span> 
               <input type="checkbox" class="toggle" bind:checked={currentDouble} on:click={dailyDouble}/>
            </label>
         </div>

      {:else}
         <div class="flex flex-col gap-2 items-center bg-slate-600 p-4">
            {#each playerList as p}
               {#if p.wager}
                  <div class="flex flex-row items-justify">
                     <div class="btn-group mx-2">
                        <button class="btn btn-sm md:btn-md btn-primary" on:click={()=>updateScore(p.wager, p.username)}>
                           <CheckCircleIcon size=30/>
                        </button>
                        <button class="btn btn-sm md:btn-md btn-error" on:click={()=>updateScore(-p.wager, p.username)}>
                           <XCircleIcon size=30/>
                        </button>
                     </div>
                     <div class="btn-group mx-2">
                        <div 
                           class="btn btn-sm md:btn-md btn-{colors[p.color]}" 
                           on:click={()=>updateQueue(p.username)}
                           on:keypress={()=>{}}
                        >{p.username}</div> 
                        <div class="btn btn-sm md:btn-md btn-outline">{p.wager}</div>
                        <div class="btn btn-sm md:btn-md btn-outline btn-accent">{p.answer || '🤔'}</div>
                     </div>
                  </div>
               {/if}
            {/each}
         </div>
      {/if}
   </div>

   <div class="flex flex-row gap-2 h-20 items-center bg-slate-800 w-full">
      {#each playerList as p}
         <div class="btn-group mx-2">
            <div 
               class="btn btn-sm md:btn-md btn-{colors[p.color]}" 
               on:click={()=>updateQueue(p.username)}
               on:keypress={()=>{}}
            >{p.username}</div> 
            <div class="btn btn-sm md:btn-md btn-outline">{p.score}</div>
         </div>
      {/each}
   </div>
   
   {#if answerQueue.length > 0}
      <div class="flex flex-col m-auto items-center gap-y-2">
         <div class="btn-group">
            <button class="btn btn-outline btn-primary" on:click={correctAnswer}>
               <CheckCircleIcon size=30/>
            </button>
            <button class="btn btn-outline btn-error" on:click={wrongAnswer}>
               <XCircleIcon size=30/>
            </button>
            <button class="btn btn-outline btn-warning" on:click={pass}>Pass</button>
         </div>

         {#key playerList}
            {#each answerQueue as a}
               {@const p = getPlayer(a)}
               <div class="btn btn-sm btn-{colors[p.color]}">
                  {p.username} {p.wager? ': ' + p.wager:''}
               </div> 
            {/each}
         {/key}

      </div>
   {/if}
</div>



<h3>Logs</h3>
<div class="max-h-60 overflow-y-scroll text-left">
<ul>
   {#each [...logs].reverse() as l}
      <li transition:fade>{l}</li>
   {/each}
</ul>
</div>