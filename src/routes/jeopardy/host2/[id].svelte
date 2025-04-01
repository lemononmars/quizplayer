<script lang=ts>
   import {onMount, onDestroy} from 'svelte'
   import {fade} from 'svelte/transition'
   import {type PlayerInfo, type GameState, type RoomInfo, type GameInfo} from '$lib/interfaces/jeopardy'
   import {demo as gameInfo} from '$lib/data/jeopardy'

   import {loadSounds, type soundType} from '$lib/sounds'
   import {CheckCircleIcon, XCircleIcon, Volume2Icon, VolumeXIcon, RefreshCwIcon, DownloadCloudIcon} from 'svelte-feather-icons'

   import { supabaseClient } from '$lib/supabase'
	import WhiteBoardShow from '$lib/components/WhiteBoardShow.svelte';

   // room info
   export let id: string
   const channel =  supabaseClient.channel('quiz-' + id)
   let playerList: PlayerInfo[] = []

   // settings 
   let sounds: any = {}
   let soundOn: boolean = false
   const colors:string[] = ['primary', 'accent', 'info' , 'error']
   let logs: string[] = []
   
   // game state
   let gameState: GameState = {
      round: 0,
      isLocked: true,
      isDouble: false,
      isWagering: false,
      isAnswering: false
   }
   let currentDouble: boolean = false
   
   // questions
   
   let currentCategory: number = -1
   let currentDifficulty: number = -1
   let currentQuestion: string= ''
   let currentAnswer: string= ''
   let chosen: boolean[][] = []
   const NUMCAT: number = 6
   const NUMQPERCAT: number = 5
   for(let i = 0;i < NUMCAT; i ++)
      chosen.push(new Array(NUMQPERCAT).fill(false))

   const baseScore = 200
   $: currentScore = baseScore*(currentDifficulty+1)*gameState.round
   // answering
   
   let revealAnswer: boolean = false
   let answerQueue: string[] = []
   const MAX_ANSWER: number = 5000
   let answerTimer: any = ''
   let answerImage: any = null // to be changed to an array

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
            //if(!gameState.isAnswering) return

            const {playerInfo, image} = payload.payload
            const {username, answer} = playerInfo
            
            const p = getPlayer(username)
            if(answer) p.answer = answer
            if(image) p.image = image
            playerList = playerList
         }
      )

      channel.on('broadcast',{ event: 
         'playerJoin' },
         (payload) => {
            const newUsername = payload.payload.info.username
            const dupe = playerList.some(p=>p.username == newUsername)
            if(!dupe) {
               playerList = [...playerList, payload.payload.info] 
               addLog(newUsername + ' joined')
            }
            else
               addLog(newUsername + ' rejoined')

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
            addLog(leftPlayerUsername + ' disconnected')
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
      revealAnswer = false
      currentQuestion = ''
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
      const s = p.wager && p.wager > 0 ? p.wager: currentScore
      
      p.wager = 0
      gameState.isDouble = false
      updateScore(s, p.username)
      revealAnswer = true
   }

   function wrongAnswer() {
      if(answerQueue.length == 0) return
      playSound('incorrect')
      const q = answerQueue.shift() || ''
      const p = getPlayer(q)
      const s = (p.wager && p.wager > 0) ? p.wager: currentScore
      // always reset just in case
      p.wager = 0
      updateScore(-s, p.username)
      answerQueue = answerQueue

      if(gameState.isDouble)
         revealAnswer = true
   }

   function updateScore(s: number, username: string) {
      clearTimeout(answerTimer)
      answerQueue.shift()

      channel.send({
         type: 'broadcast',
         event: 'updateScore',
         payload: { score: s, username },
      })
      addLog((s>0? '✅': s<0? '❌': '') + username + ' gets ' + s + ' points')

      const p = getPlayer(username)
      p.score += s
      p.wager = 0
      p.answer = ''
      playerList = playerList

      if(gameState.isDouble) {
         gameState.isDouble = false
         currentDouble = false
      }
   }

   function updateQueue(u: string) {
      addLog(u + ' pushed')
      if(answerQueue.length > 0) return // remove if queueing is allowed

      answerTimer = setTimeout(()=>{
         gameState.isLocked = false
         gameState = gameState
         playSound('timesup')
         channel.send({type:'broadcast', event: 
            'toggleLockedButton',
            payload: {isLocked: true}
         })
      }, MAX_ANSWER)
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
      addLog('Round ' + r + ' starts!')
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

   function chooseQuestion(row: number, col: number) {
      chosen[col][row] = true
      currentCategory = col
      currentDifficulty = row
      currentQuestion = gameInfo.round1.questions[col][row]
      currentAnswer = gameInfo.round1.answers[col][row]
      currentScore = (row+1)*200*gameState.round

      addLog(gameInfo.round1.categories[col] + ' for $' + currentScore)
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
   
   function handleKeyPress(event: KeyboardEvent) {
      // KeyR
      if(currentQuestion)
         if (event.code === 'Space' && gameState.isLocked)
            toggleLockButton()
         if (event.code === 'ArrowRight')
            if(!revealAnswer && !gameState.isLocked)
               revealAnswer = true
            else
               resetButton()
	}

   function downloadLog() {
      var pom = document.createElement('a');
      const text = logs.reduce((p,c) => p + '\n' + c, '')
      pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      pom.setAttribute('download', 'jeopardygame.txt');

      if (document.createEvent) {
         var event = document.createEvent('MouseEvents');
         event.initEvent('click', true, true);
         pom.dispatchEvent(event);
      }
      else {
         pom.click();
      }
   }

   onDestroy(()=>{
      supabaseClient.removeChannel(channel)
   })
</script>

<svelte:head> 
   <title>Hosting Jeopardy</title>
</svelte:head>

<svelte:window
   on:keydown|preventDefault={handleKeyPress}
/>

{#if gameState.round == 0}
   <div class="flex flex-col gap-2 justify-center items-center w-full h-full">

      <h2>Room ID: {id}</h2>
      {#each playerList as p}
         <div 
            class="btn btn-{colors[p.color]}" 
         >{p.username}</div> 
      {:else}
         <h3>Nobody has joined yet...</h3>
      {/each}
      
      <button class="btn btn-circle btn-xl btn-success" on:click={()=>updateRound(1)}>Start!</button>
   </div>


{:else if gameState.round == 3}

   <div class="flex flex-col gap-2 justify-center w-full h-full border-2">

      <div class="flex flex-row justify-between items-center">
         <button class="btn btn-outline btn-success" on:click={()=>updateRound(1)}>Back</button>
         <div>
            <h2>Final Jeopardy!</h2>
         </div>
         <div>
            <button class="btn btn-sm btn-circle btn-outline" on:click={()=>soundOn = !soundOn}>
               {#if soundOn}
                  <Volume2Icon size=20 class="text-success"/>
               {:else}
                  <VolumeXIcon size=20 class="text-error"/>
               {/if}
            </button>
            <button class="btn btn-sm " on:click={downloadLog}><DownloadCloudIcon size=20/></button>
         </div>
      </div>

      {#each playerList as p}
         <div class="btn btn-{colors[p.color]} text-2xl">{p.username}</div>

         {#key p.image}
            {#if p.image}
               <WhiteBoardShow answerImage={p.image}/>
            {:else}
               <h1>🤔</h1>
            {/if}
         {/key}

         <div class="btn btn-{colors[p.color]} text-2xl">{p.wager}</div>

         <div class="btn-group mx-auto">
            <button class="btn btn-sm md:btn-md btn-primary" on:click={()=>updateScore(p.wager, p.username)}>
               <CheckCircleIcon size=30/>
            </button>
            <button class="btn btn-sm md:btn-md btn-error" on:click={()=>updateScore(-p.wager, p.username)}>
               <XCircleIcon size=30/>
            </button>
         </div>
      {/each}
   </div>
{:else}
   <div class="flex flex-row justify-between">
      <button class="btn btn-outline btn-success btn-xl" on:click={()=>updateRound(3)}>To Final!</button>
      <div>
         <h2>Round {gameState.round}</h2>
      </div>
      <button class="btn btn-sm btn-circle btn-outline" on:click={()=>soundOn = !soundOn}>
         {#if soundOn}
            <Volume2Icon size=20 class="text-success"/>
         {:else}
            <VolumeXIcon size=20 class="text-error"/>
         {/if}
      </button>
   </div>
   <div class="w-full h-full border-2">
      <div class="grid grid-cols-6 grid-rows-5 gap-1 m-2 place-items-stretch place-content-stretch">
         {#each gameInfo.round1.categories as cat}
            <div class="btn btn-outline">{cat}</div>
         {/each}
         {#each Array(5) as _, row}
            {#each Array(6) as _, col}
               <div class="btn btn-outline w-auto h-auto text-2xl transform transition-transform"
                  style="transform:translate(0px, 0px) scale(1,1);"
                  class:invisible={chosen[col][row]}
                  on:click={()=>chooseQuestion(row, col)}
                  on:keypress={()=>{}}
               >
                  ${(row+1)*200*gameState.round}
               </div>
            {/each}
         {/each}
      </div>
   </div>

   <!-- Show question -->
   <div 
      class='fixed top-0 left-0 w-full h-full flex flex-col place-content-between justify-center bg-info'
      class:hidden={!currentQuestion}
   >
      <!-- Question - Answer part -->
      <div class='flex flex-col justify-center'>
         <div class="badge badge-xl">{gameInfo.round1.categories[currentCategory]} - ${currentScore}</div>

         <div class='text-9xl'>{currentQuestion}</div>

         {#if revealAnswer}
            <div class="badge badge-xl">Answer</div>

            <div class='text-3xl'>{currentAnswer}</div>
         {/if}
      </div>

      <!-- Bottom part -->
      <div class="relative bottom-0 justify-center w-full">
         {#if answerQueue.length > 0}
            <div class="flex flex-row justify-center items-center gap-x-2">
               {#each answerQueue as a}
                  {@const p = getPlayer(a)}
                  <div class="btn btn-{colors[p.color]}">
                     {p.username} {p.wager? ': ' + p.wager:''}
                  </div> 
               {/each}

               <div class="btn-group">
                  <button class="btn btn-outline btn-primary" on:click={correctAnswer}>
                     <CheckCircleIcon size=30/>
                  </button>
                  <button class="btn btn-outline btn-error" on:click={wrongAnswer}>
                     <XCircleIcon size=30/>
                  </button>
                  <button class="btn btn-outline btn-warning" on:click={pass}>Pass</button>
               </div>
            </div>
         {:else}
            {#if revealAnswer}
               <div class="btn btn-outline w-full gap-2" on:click={resetButton} on:keypress={resetButton}>
                  Next
                  <div class="kbd">▶︎</div>
               </div>
            {:else}
               {#if gameState.isLocked}
                  <div class="btn w-full btn-error gap-2" class:btn-outline={!gameState.isLocked} on:click={toggleLockButton} on:keypress={handleKeyPress}>
                     Activate buzzer
                     <div class="kbd">space</div>
                  </div>
               {:else}
                  <div class="btn btn-outline w-full btn-warning gap-2" on:click={()=>{revealAnswer = true}} on:keypress={handleKeyPress}>
                     Reveal answer 
                     <div class="kbd">▶︎</div>
                  </div>
               {/if}
            {/if}
         {/if}
      </div>
   </div>

   <div class="flex flex-row gap-2 h-20 items-center bg-slate-800 fixed w-screen left-0 bottom-0 justify-center">
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

{/if}



<!-- <h3>Logs</h3>
<div class="max-h-60 overflow-y-scroll text-left">
<ul>
   {#each [...logs].reverse() as l}
      <li transition:fade>{l}</li>
   {/each}
</ul>
</div> -->

<style>
   .clueModal {
    position: fixed;
    top: 0;
    left: 0;
    background: #060ce9;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    z-index: 51;
    background-color: #03066c;
    background-attachment: fixed;
    background-blend-mode: overlay;
   }
</style>