<script lang=ts>
   import {onMount, onDestroy} from 'svelte'
   import {type PlayerInfo, type GameState} from '$lib/interfaces/jeopardy'
   import {CheckCircleIcon, XCircleIcon} from 'svelte-feather-icons'

   import {supabaseClient } from '$lib/supabase'
   import {storePlayerList, username} from '$lib/store';

   const channel =  supabaseClient.channel('button')

   let answerQueue: string[] = []

   let gameState: GameState = {
      round: 1,
      isLocked: true,
      isDouble: false,
      isWagering: false,
      isAnswering: false
   }

   let playerList: PlayerInfo[] = []
   let initializing: boolean = true

   const MAX_ANSWER: number = 5000
   let answerTime: number = 0
   let answerTimer: any = ''

   function getPlayer(username: string) {
      for(var p of playerList)
         if(p.username === username)
            return p
      // bad practice
      return playerList[0]
   }

   onMount(async()=>{
      channel.on('broadcast',{ event: 
         'pushButton' },
         (payload) => {
            updateQueue(payload.payload.username)
         }
      )

      channel.on('broadcast',{ event: 
         'playerJoin' },
         (payload) => {
            const newUsername = payload.payload.info.username
            const dupe = playerList.some(p=>p.username == newUsername)
            if(!dupe) {
               playerList = [...playerList, payload.payload.info] 
               $storePlayerList = JSON.stringify(playerList)
            }

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
            const leftId = playerList.findIndex(p=>p.username == leftPlayerUsername)
            if (leftId > -1)
               playerList.splice(leftId)
            playerList = playerList
            $storePlayerList = JSON.stringify(playerList)
         }
      )

      channel.on('broadcast',{ event: 
         'resendPlayerList' },
         (payload) => {
            if(playerList.length > 0) return
            playerList = payload.payload.playerList
            $storePlayerList = JSON.stringify(playerList)
         }
      )

      subscribe()

      document.addEventListener('visibilitychange', () => {
         if (!document.hidden) {
            if (!channel) {
               subscribe()
            }
         }
      })
      window.addEventListener('focus', () => {
         if (!channel) {
            subscribe()
         }
      })
   })

   function subscribe() {
      channel.subscribe((status) => {
         if (status !== 'SUBSCRIBED') return null // not sure what to do here
         channel.send({
            type: 'broadcast',
            event: 'hostReconnect'
         })
         initializing = false
      })
   }

   function toggleLockButton(){
      gameState.isLocked = !gameState.isLocked
      channel.send({
         type: 'broadcast',
         event: 'toggleLockButton',
         payload: {isLocked: gameState.isLocked}
      })
   }

   function resetButton(){
      answerQueue = []
      gameState.isLocked = true // locked as default
      channel.send({
         type: 'broadcast',
         event: 'resetButton',
         payload: {}
      })
   }

   function correctAnswer() {
      if(answerQueue.length == 0) return
      const p = getPlayer(answerQueue[0])
      gameState.isDouble = false
      updateScore(1, p.username)
      resetButton()
   }

   function wrongAnswer() {
      if(answerQueue.length == 0) return
      const q = answerQueue.shift() || ''
      const p = getPlayer(q)
      // always reset just in case
      updateScore(-1, p.username)
      answerQueue = answerQueue
   }

   function updateScore(s: number, username: string) {
      clearTimeout(answerTimer)

      channel.send({
         type: 'broadcast',
         event: 'updateScore',
         payload: { score: s, username },
      })
   }

   function updateQueue(u: string) {
      if(answerQueue.length > 0) return // remove if queueing is allowed
      
      answerTime = MAX_ANSWER
      answerTimer = setInterval(()=>answerTime -= 100, 100)
      setTimeout(()=>{
         clearInterval(answerTimer)
         answerTime = 0
      }, MAX_ANSWER)

      answerQueue = [...answerQueue, u]

      channel.send({type:'broadcast', event: 
         'updateQueue',
         payload: {username: u}
      })
   }

   function updateGameState() {
      channel.send({
         type: 'broadcast',
         event: 'updateGameState',
         payload: { gameState },
      })
   }

   onDestroy(()=>{
      supabaseClient.removeChannel(channel)
   })
</script>

<div class="flex flex-col items-center gap-y-2 my-10 w-full">
   {#if gameState.isLocked}
      <div class="btn w-60 text-xl btn-error" class:btn-outline={!gameState.isLocked} on:click={toggleLockButton} on:keypress={()=>{}}>
         End of question
      </div>
   {:else}
      <div class="btn w-60 text-xl btn-outline btn-accent" on:click={resetButton} on:keypress={()=>{}}>
         Next question
      </div>
   {/if}

   <div class="flex flex-row gap-2 h-20 justify-around items-center bg-slate-800 w-full">
      {#if initializing}
         <div class="text-warning">Searching for players</div>
      {:else}
         {#each playerList as p}
            <div class="btn btn-sm md:btn-md">{p.username}</div> 
         {:else}
            <div class="btn btn-error">No player</div>
         {/each}
      {/if}
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
         </div>

         {#key playerList}
            {#each answerQueue as a}
               {@const p = getPlayer(a)}
               <div class="btn btn-sm">
                  {p.username} {answerTime > 0? Math.floor(answerTime/1000) + '.' + answerTime/100%10 + ' s': "Time's up!"}
               </div> 
            {/each}
         {/key}

      </div>
   {/if}
</div>