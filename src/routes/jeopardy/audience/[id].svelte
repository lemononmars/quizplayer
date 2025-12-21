<script lang=ts>
   import {onMount} from 'svelte'
   import {type PlayerInfo, type GameState} from '$lib/interfaces/jeopardy'

   import { supabaseClient } from '$lib/supabase'
   import CountDownBar from '$lib/components/CountDownBar.svelte';

   export let id: string
   const channel =  supabaseClient.channel('quiz-' + id)

   const colors:string[] = ['primary', 'accent', 'info' , 'error']
   let answerQueue: string[] = []
   let playerList: PlayerInfo[] = []
   let gameState: GameState = {
      round: 1,
      isLocked: false,
      isDouble: false,
      isWagering: false,
      isAnswering: false
   }

   const MAX_ANSWER: number = 5000
   const MAX_DOUBLE_ANSWER: number = 7000
   $: maxAnswerTime = gameState.round == 3 ? MAX_DOUBLE_ANSWER : MAX_ANSWER
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
         'playerJoin' },
         (payload) => {
            const newUsername = payload.payload.info.username
            const dupe = playerList.some(p=>p.username == newUsername)
            if(!dupe) {
               playerList = [...playerList, payload.payload.info] 
            }
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
         'updateScore' },
         (payload) => { 
            const {score, username} = payload.payload
            getPlayer(username).score += parseInt(score)
            playerList = playerList

            clearInterval(answerTimer)
            
            answerQueue.shift()
            answerQueue = answerQueue
         }
      )

      channel.on('broadcast',{ event:
         'updateQueue' },
         (payload) => {
            const u = payload.payload.username
            answerQueue = [...answerQueue, u]

            answerTime = MAX_ANSWER
               answerTimer = setInterval(()=> {
                  answerTime -= 100
                  if(answerTime <= 0) {
                     clearInterval(answerTimer)
                     answerTime = 0
                  }
               }, 100)
         }
      )

      channel.on('broadcast', { event: 
         'updateGameState' },
         (payload) => { 
            gameState = payload.payload.gameState
         }
      )

      channel.on('broadcast',{ event: 
         'resendPlayerList' },
         (payload) => {
            playerList = payload.payload.playerList
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
      if(channel.state === 'joined') {
         channel.send({
            type: 'broadcast',
            event: 'hostReconnect'
         })
         return
      }
      channel.subscribe(() => {
         channel.send({
            type: 'broadcast',
            event: 'hostReconnect'
         })
      })
   }
</script>

<div class="flex flex-col items-center gap-y-2 my-10w-full">

   <div class="flex flex-col justify-center gap-2 items-center bg-slate-800 w-full h-3/4 p-4">
      {#each playerList as p}
         <div class="btn-group btn-xl mx-auto w-full h-40">
            <div 
               class="btn btn-xl btn-{colors[p.color]} text-4xl w-2/3 h-full"
            >{p.username}</div> 
            <div class="btn btn-xl btn-outline text-4xl w-1/3 h-full">{p.score}</div>
         </div>
      {:else}
         <div class="text-2xl">No players have joined yet.</div>
      {/each}
   </div>
   
   {#if answerQueue.length > 0}
      <div class="flex flex-col m-auto items-center gap-y-2 w-full h-1/4">

         {#key answerQueue}
            {#each answerQueue as a}
               {@const p = getPlayer(a)}
               <div class="btn btn-sm md:btn-lg btn-{colors[p.color]} text-4xl w-full h-1/2">
                   {p.username}
               </div> 
            {/each}

         <CountDownBar bind:answerTime {maxAnswerTime}/>
         {/key}

      </div>
   {/if}
</div>