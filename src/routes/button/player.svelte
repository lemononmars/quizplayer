<script lang=ts>
   import {onMount, onDestroy} from 'svelte'
   import {type PlayerInfo, type GameState} from '$lib/interfaces/jeopardy'

   import { supabaseClient } from '$lib/supabase'
	import { username} from '$lib/store';

   const channel = supabaseClient.channel('button')

   let myInfo: PlayerInfo = 
      {
         username: 'Player',
         color: 0,
         score: 0,
         wager: 0,
         answer: ''
      }

   let gameState: GameState =
      {
         round: 1,
         isLocked: false,
         isDouble: false,
         isWagering: false,
         isAnswering: false
      }

   let isLoggedIn: boolean = false
   $: isConnected = !!channel
   let isPushed: boolean = false
   let pushable: boolean = true
   let answerQueue: string[] = []

   let statusText: string = 'READY'
   let penaltyPeriod: boolean = false
   const MAX_ANSWER: number = 5000
   const MAX_PENALTY: number = 250 // 0.25 seconds 
   let answerTime: number = 0
   let answerTimer: any = ''
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
      channel.on('broadcast',{ event: 
         'toggleLockButton' },
         (payload) => { 
            gameState.isLocked = payload.payload.isLocked
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
            getPlayer(username).score += parseInt(score)
            playerList = playerList

            if(username === myInfo.username) {
               clearInterval(penaltyTimer)
               clearInterval(answerTimer)
               penaltyTime = 0
               answerTime = 0
            }

            if(score > 0) {
               resetQuestion()
            }
            else {
               // non-positive score -> other players can push
               if(username !== myInfo.username)
                  pushable = true
               answerQueue.shift()
               answerQueue = answerQueue
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
         }
      )

      channel.on('broadcast',{ event: 
         'playerLeave' },
         (payload) => {
            const leftUsername = payload.payload.username
            playerList = playerList.filter(p => p.username !== leftUsername)
            playerList = playerList
         }
      )

      channel.on('broadcast',{ event: 
         'hostReconnect' },
         () => {
            channel.send({type: 'broadcast',event: 
               'resendPlayerList',
               payload: { playerList },
            })
         }
      )

      document.addEventListener('visibilitychange', () => {
         if (!document.hidden) {
            if (!channel) {
               login()
            }
         }
      })
      window.addEventListener('focus', () => {
         if (!channel) {
            login()
         }
      })
   })

   function login() {
      myInfo = {
         username: newUsername,
         color: 0,
         score: 0,
         wager: 0,
         answer: ''
      }
      $username = newUsername

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
         return // 0.25 s penalty  
      }
      else {
         isPushed = true
         answerTime = MAX_ANSWER
         answerTimer = setInterval(()=>answerTime -= 100, 100)
         setTimeout(()=>{
            clearInterval(answerTimer)
            answerTime = 0
         }, MAX_ANSWER)
      }

      channel.send({type: 'broadcast',event: 
         'pushButton',
         payload: { username: myInfo.username },
      })
   }

   function resetQuestion() {
      isPushed = false
      pushable = true
      gameState.isLocked = true
      gameState.isDouble = false
      answerQueue = []
      clearInterval(answerTimer)
      updateStatusText()
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
   <title>Quiz Button (Player)</title>
</svelte:head>

{#if isLoggedIn}
   {#if !isConnected}
      <div>Reconnecting...</div>
   {/if}
   <div class="flex flex-row w-full my-8 justify-center items-center mx-auto gap-3">
      <div class="btn btn-lg}">{myInfo.username}</div> 
   </div>

   <div class="flex flex-col w-full justify-center mx-auto items-center gap-2 my-4">
      {#if (!gameState.isAnswering && !gameState.isWagering && (!gameState.isDouble || answerQueue[0] !== myInfo.username))}
         {#if penaltyTime > 0}
            <div class="radial-progress bg-error text-error-content border-4 border-error w-60 h-60 m-8 text-4xl" style="--value:{penaltyTime*100/MAX_PENALTY};">PENALTY</div>
         {:else if answerTime > 0}
            <div class="radial-progress bg-success text-success-content border-4 border-success w-60 h-60 m-8 text-4xl" style="--value:{answerTime*100/MAX_ANSWER};">{Math.floor(answerTime/1000)}.{answerTime/100%10} s</div>
         {:else}
            <div 
               class="btn btn-circle w-60 h-60 text-4xl m-8" 
               class:btn-ghost={gameState.isLocked || (isPushed && !pushable)}
               class:btn-outline={gameState.isLocked || !pushable}
               class:btn-warning={isPushed} 
               class:btn-success={pushable && !isPushed && !gameState.isLocked} 
               on:click={pushButton}
               on:keypress={()=>{}}
            >
               {statusText}
            </div>
         {/if}
      {/if}
   </div>

   <div class="flex flex-col md:flex-row gap-2 p-4 md:h-20 items-center bg-slate-800 w-full">
      {#each playerList as p} 
         <div class="btn-group mx-2">
            <div class="btn btn-sm md:btn-md">{p.username}</div> 
         </div>
      {/each}
   </div>
{:else}
   <!--  log in page -->
   <div class="flex flex-col items-center gap-y-6">
      <h1>Type Username:</h1>
         <input class="input input-bordered text-3xl w-40 justify-center text-center" type="text" placeholder="username" bind:value={newUsername}>
      <button class="btn btn-xl btn-success btn-" on:click={login}>Join</button>
   </div>
{/if}

