<script lang=ts>
   import {onMount, onDestroy} from 'svelte'
   import {fade} from 'svelte/transition'
   import {type PlayerInfo, type GameState, type RoomInfo} from '$lib/interfaces/jeopardy'
   import {loadSounds, type soundType} from '$lib/sounds/'
   import {VolumeXIcon, Volume2Icon, PenToolIcon, XCircleIcon, CheckCircleIcon} from 'svelte-feather-icons'

   
   import { supabaseClient } from '$lib/supabase'
	import { username, storeGameState, storeMyInfo, storeRoomInfo } from '$lib/store';
	import WhiteBoard from '$lib/components/WhiteBoardInput.svelte';

   export let id: string
   const channel = supabaseClient.channel('quiz-' + id)
   let myColor: number = 0
   const colors:string[] = ['primary', 'accent', 'info' , 'error']

   let myInfo: PlayerInfo = $storeMyInfo !== ''? JSON.parse($storeMyInfo): 
      {
         username: 'Player',
         color: 0,
         score: 0,
         wager: 0
      }

   let gameState: GameState = $storeGameState!== '' ? JSON.parse($storeGameState): 
      {
         round: 1,
         isLocked: false,
         isDouble: false,
         isWagering: false,
         isAnswering: false
      }

   let isLoggedIn: boolean = false
   let isPushed: boolean = false
   let pushable: boolean = true
   let logs: string[] = []
   let answerQueue: string[] = []
   let currentWager: number = 0
   let currentAnswer: string = ''

   let soundOn: boolean = false 
   let sounds: any = []
   let statusText: string = 'READY'
   let penaltyPeriod: boolean = false
   const MAX_PENALTY: number = 250 // 0.25 seconds
   const MAX_ANSWER: number = 5000
   let penaltyTime: number = 0
   let penaltyTimer: any = ''

   function getPlayer(username: string) {
      for(var p of playerList)
         if(p.username === username)
            return p
      // shouldn't get here, but just in case
      return playerList[0]
   }

   function updateStatusText() {
      if(gameState.isLocked)
         statusText = 'LOCK'
      else if(answerQueue.length == 0)
         if(!pushable)
            statusText = 'Wait...'
         else
            statusText = 'READY'
      else if(answerQueue[0] === myInfo.username)
         statusText = 'Answer!'
      else 
         statusText = answerQueue[0]
   }

   let playerList: PlayerInfo[] = []
   let newUsername: string = $username !== 'code breaker'? $username: ''
   

   onMount(async()=>{
      sounds = loadSounds()

      channel.on('broadcast',{ event: 
         'toggleLockButton' },
         (payload) => { 
            gameState.isLocked = payload.payload.isLocked
            addLog('button ' + (gameState.isLocked?'':'un') + 'locked!')
            updateStatusText()
         }
      )

      channel.on('broadcast', { event: 
         'resetButton' },
         () => { 
            resetQuestion()
         }
      )

      channel.on('broadcast',{ event: 
         'updateScore' },
         (payload) => { 
            const {score, username} = payload.payload
            addLog((score>0? '✅': score<0? '❌': '') + username + ' gets ' + score + ' points')
            getPlayer(username).score += parseInt(score)
            playerList = playerList

            if(username === myInfo.username) {
               clearTimeout(penaltyTimer)
            }

            if(gameState.isDouble || score > 0) {
               resetQuestion()
               if(score > 0)
                  playSound('correct')
            }
            else {
               // non-positive score -> other players can push
               if(username !== myInfo.username)
                  pushable = true
               answerQueue.shift()
               answerQueue = answerQueue
               if (score < 0)
                  playSound('incorrect')
               else
                  playSound('timesup')
               updateStatusText()
            }
         }
      )

      channel.on('broadcast',{ event:
         'updateQueue' },
         (payload) => {
            pushable = false
            answerQueue = [...answerQueue, payload.payload.username]
            updateStatusText()
         }
      )

      channel.on('broadcast', { event: 
         'updateGameState' },
         (payload) => { 
            gameState = payload.payload.gameState
            updateStatusText()
         }
      )

      // received the first time this user joins from host
      channel.on('broadcast',{event: 
         'sharePlayerList'},
         (payload) => {
            if(playerList.length > 1) return
            playerList = payload.payload.playerList
            // when reconnected, update your own info
            for(var p of playerList) {
               if(p.username === myInfo.username)
                  myInfo = p 
            }
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
            playSound('ping')
         }
      )

      channel.on('broadcast',{ event: 
         'playerLeave' },
         (payload) => {
            const leftUsername = payload.payload.username
            playerList = playerList.filter(p => p.username !== leftUsername)
            playerList = playerList
            addLog(leftUsername + ' left')
         }
      )
   })

   function login() {
      myInfo = {
         username: newUsername,
         color: myColor,
         score: 1000,
         wager: 0,
         answer: ''
      }
      $storeMyInfo = JSON.stringify(myInfo)

      channel.subscribe((status) => {
         if (status !== 'SUBSCRIBED') return null
         
         channel.send({type: 'broadcast',event: 
            'playerJoin',
            payload: { info: myInfo },
         })
      })

      isLoggedIn = true
      playerList.push(myInfo)
      playerList = playerList
   }

   function pushButton(){
      
      if(isPushed || !pushable) return 

      if(gameState.isLocked) {
         penaltyPeriod = true
         penaltyTime = MAX_PENALTY
         penaltyTimer = setInterval(()=>penaltyTime -= 10, 10)
         setTimeout(()=>{
            penaltyPeriod = false
            clearInterval(penaltyTimer)
            penaltyTime = 0
         }, MAX_PENALTY)
         playSound('timesup')
         return // 2.5 s penalty  
      }
      else {
         isPushed = true
         setTimeout(()=>{
            gameState.isLocked = true
            gameState = gameState
            playSound('timesup')
         }, MAX_ANSWER)
      }

      playSound('ping')
      channel.send({type: 'broadcast',event: 
         'pushButton',
         payload: { username: myInfo.username },
      })
   }

   function submitWager() {
      if(currentWager == 0) return
      if(currentWager > Math.abs(myInfo.score)) {
         currentWager = 0
         addLog("!!!wager invalid!!!")
         return
      }
      myInfo.wager = currentWager

      channel.send({type: 'broadcast',event: 
         'submitWager',
         payload: { playerInfo: myInfo },
      })
   }

   function submitAnswer() {
      myInfo.answer = currentAnswer
      channel.send({type: 'broadcast',event: 
         'submitAnswer',
         payload: { 
            playerInfo: myInfo, 
         },
      })
   }

   function submitImage(event: any) {
      channel.send({type: 'broadcast',event: 
         'submitAnswer',
         payload: { 
            playerInfo: myInfo, 
            image: event.detail.image
         },
      })
   }

   function resetQuestion() {
      addLog('reset')
      isPushed = false
      pushable = true
      gameState.isLocked = true
      gameState.isDouble = false
      currentWager = 0
      myInfo.wager = 0
      currentAnswer = ''
      myInfo.answer = ''
      answerQueue = []

      updateStatusText()
   }
   function addLog(message: string) {
      const timestamp = new Date().toLocaleTimeString()
      logs = [...logs, timestamp + ' - ' + message]
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

   function keyPress(k) {
      
   }

   onDestroy(()=>{
      channel.send({type: 'broadcast', event: 
         'playerLeave',
         payload: { username: myInfo.username },
      })
      supabaseClient.removeChannel(channel)
      isLoggedIn = false
   })
</script>

<svelte:head> 
   <title>Playing Jeopardy</title>
</svelte:head>

{#if isLoggedIn}
   <div class="flex flex-row w-full my-8 justify-center items-center mx-auto gap-3">
      <div class="btn-group mx-2">
         <div class="btn btn-sm md:btn-md btn-{colors[myInfo.color]}">{myInfo.username}</div> 
         <div class="btn btn-sm md:btn-md btn-outline">{myInfo.score}</div>
      </div>
      <button class="btn btn-sm btn-circle btn-outline" on:click={()=>soundOn = !soundOn}>
         {#if soundOn}
            <Volume2Icon size=20 class="text-success"/>
         {:else}
            <VolumeXIcon size=20 class="text-error"/>
         {/if}
      </button>
   </div>

   <div class="flex flex-col w-full justify-center mx-auto items-center gap-2 my-4">
      {#if gameState.isWagering || (gameState.isDouble && answerQueue[0] === myInfo.username)}
         <div class="form-control">
            <label class="input-group mx-auto">
               <div class="btn btn-info">💰</div>
               <input 
                  type="text"
                  class="input input-bordered text-xl input-info w-20" 
                  class:text-error={currentWager > Math.abs(myInfo.score)}
                  disabled={!!myInfo.wager}
                  placeholder="1-{myInfo.score}"
                  bind:value={currentWager}
               /> 
               <div class="btn" 
                  on:click={submitWager} 
                  on:keypress={()=>{}}
                  class:btn-success={currentWager <= Math.abs(myInfo.score)}
                  class:btn-disabled={currentWager > Math.abs(myInfo.score) || myInfo.wager}
               >
                  {currentWager <= Math.abs(myInfo.score)?      
                  'Wager $' + currentWager:
                  'Invalid' }
                  
               </div>
            </label>
         </div>
      {/if}

      {#if gameState.isAnswering && myInfo.wager}
         <div class="form-control">
            <label class="input-group">
               <div class="btn btn-accent">Answer</div>
               <input 
                  type="text"
                  class="input input-bordered input-info" 
                  disabled={!!myInfo.answer}
                  placeholder="type answer"
                  bind:value={currentAnswer}
               /> 

               <div class="btn btn-success" 
                  on:click={submitAnswer} 
                  on:keypress={()=>{}}
                  class:btn-disabled={myInfo.answer}
               >lock in
               </div>
            </label>
         </div>
         <WhiteBoard on:submitImage={submitImage}/>
      {/if}
      <!-- Whiteboard -->
      

      {#if (!gameState.isAnswering && !gameState.isWagering && (!gameState.isDouble || answerQueue[0] !== myInfo.username))}
         {#if penaltyTime > 0}
            <div class="radial-progress bg-error text-error-content border-4 border-error w-60 h-60 m-8 text-4xl" style="--value:{penaltyTime*100/MAX_PENALTY};">PENALTY</div>
         {:else}
            <div 
               class="btn btn-circle w-60 h-60 text-4xl m-8" 
               class:btn-ghost={gameState.isLocked || (isPushed && !pushable)}
               class:btn-outline={gameState.isLocked || !pushable}
               class:btn-warning={isPushed} 
               class:btn-success={pushable && !isPushed && !gameState.isLocked} 
               on:click={pushButton}
               on:keypress={keyPress}
            >
               {statusText}
            </div>
         {/if}
      {/if}
   </div>

   <div class="flex flex-col md:flex-row gap-2 p-4 md:h-20 items-center bg-slate-800 w-full">
      {#each playerList as p} 
         <div class="btn-group mx-2">
            <div class="btn btn-sm md:btn-md btn-{colors[p.color]}">{p.username}</div> 
            <div class="btn btn-sm md:btn-md btn-outline">{p.score}</div>
         </div>
      {/each}
   </div>

   <div class="max-h-60 overflow-y-scroll text-left">
      <h3>Logs</h3>
      <ul>
         {#each [...logs].reverse() as l}
            <li transition:fade>{l}</li>
         {/each}
      </ul>
   </div>

{:else}
   <!--  log in page -->
   <div class="flex flex-col items-center gap-y-6">
      <h1>Type Username:</h1>
         <input class="input input-bordered text-3xl w-40 justify-center text-{colors[myColor]} text-center" type="text" placeholder="username" bind:value={newUsername}>
         
      <h1>Choose player color:</h1>

      <div class="flex flex-row gap-2">
         {#each colors as c, index}
            <button class="btn btn-square gap-2 btn-{c}" class:btn-outline={index != myColor} on:click={()=>myColor = index}/>
         {/each}
      </div>

      <button class="btn btn-xl btn-success btn-" on:click={login}>Join</button>
   </div>
{/if}

