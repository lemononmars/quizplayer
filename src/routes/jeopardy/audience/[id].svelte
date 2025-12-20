<script lang=ts>
   import {onMount} from 'svelte'
   import {type PlayerInfo, type GameState} from '$lib/interfaces/jeopardy'

   import { supabaseClient } from '$lib/supabase'

   export let id: string
   const channel =  supabaseClient.channel('quiz-' + id)

   const colors:string[] = ['primary', 'accent', 'info' , 'error']
   let answerQueue: string[] = []

   let gameState: GameState = {
      round: 1,
      isLocked: false,
      isDouble: false,
      isWagering: false,
      isAnswering: false
   }

   let playerList: PlayerInfo[] = []

   const MAX_ANSWER: number = 5000
   let answerTime: number = 0
   let answerTimer: any = ''
   let answerTimeInterval: any = ''

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
         'updateScore' },
         (payload) => { 
            const {score, username} = payload.payload
            getPlayer(username).score += parseInt(score)
            playerList = playerList

            clearInterval(answerTimeInterval)
            
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
               answerTimeInterval = setInterval(()=> {
                  answerTime -= 100
                  if(answerTime <= 0) {
                     clearInterval(answerTimeInterval)
                     answerTime = 0
                  }
               }, 100)
         }
      )

      channel.on('broadcast',{event: 
         'sharePlayerList'},
         (payload) => {
            playerList = payload.payload.playerList
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
      channel.subscribe((status) => {
         //if (status !== 'SUBSCRIBED') 
         channel.send({
            type: 'broadcast',
            event: 'hostReconnect'
         })
      })
   }
</script>

<div class="flex flex-col items-center gap-y-2 my-10 w-full">

   <div class="flex flex-row justify-between gap-2 h-20 items-center bg-slate-800 w-full">
      {#each playerList as p}
         <div class="btn-group btn-xl mx-2 max-w-1/3">
            <div 
               class="btn btn-xl btn-{colors[p.color]} text-4xl"
            >{p.username}</div> 
            <div class="btn btn-xl btn-outline text-4xl">{p.score}</div>
         </div>
      {/each}
   </div>
   
   {#if answerQueue.length > 0}
      <div class="flex flex-col m-auto items-center gap-y-2 w-1/3">

         {#key answerQueue}
            {#each answerQueue as a}
               {@const p = getPlayer(a)}
               <div class="btn btn-sm btn-{colors[p.color]} w-full text-4xl">
                   {p.username}
               </div> 
            {/each}

         <div class="w-full flex flex-row gap-1">
            {#each [4,3,2,1,0,1,2,3,4] as t}
            <div class="w-full bg-gray-700 rounded h-8 overflow-hidden"
            class:bg-red-500={answerTime > t*1000}
            >
            </div>
            {/each}
         </div>
         {/key}

      </div>
   {/if}
</div>