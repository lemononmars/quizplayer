<script lang=ts>
   import {onMount, onDestroy} from 'svelte'
   import {loadSounds, soundType} from '$lib/sounds/'
   
   import { createClient } from '@supabase/supabase-js'
	import { username } from '$lib/store';
   const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

   const channel = supabase.channel('quiz')
   let myColor: number = 0
   const colors:string[] = ['primary', 'accent', 'info' , 'error']
   let myInfo: PlayerInfo = {
      username: 'Player',
      ID: 0,
      color: 0,
      score: 0
   }
   let isLogin: boolean = false
   let isPushed: boolean = false
   let isLocked: boolean = false
   let logs: string[] = []
   let answerQueue: string[] = []
   let sounds: any = []

   let playerList: PlayerInfo[] = []
   let newUsername: string = $username || ''
   
   interface PlayerInfo {
      username: string,
      ID: number,
      color: number,
      score: number
   }

   onMount(()=>{
      sounds = loadSounds()

      channel.on('broadcast',{ event: 
         'toggleLockButton' },
         () => { 
            isLocked = !isLocked
            addLog('button ' + (isLocked?'':'un') + 'locked!')
            if(!isLocked)
               sounds.ping.play()
         }
      )

      channel.on('broadcast', { event: 
         'resetButton' },
         () => { 
            addLog('reset')
            isPushed = false
            answerQueue = []
         }
      )

      channel.on('broadcast',{ event: 
         'updateScore' },
         (payload) => { 
            const {score, username} = payload.payload
            addLog((score>0? '✅': score<0? '❌': 'o') + username + ' gets ' + score + ' points')
            playerList.forEach(p => {
               if(p.username === username) p.score += score
            })
            playerList = playerList
            if(score > 0) {
               isPushed = false
               answerQueue = []
               sounds.correct.play()
            }
            else {
               answerQueue.shift()
               answerQueue = answerQueue
               if (score < 0)
                  sounds.incorrect.play()
               else
                  sounds.timesup.play()
            }
         }
      )

      channel.on('broadcast',{ event: 
         'updateQueue' },
         (payload) => {
            answerQueue.push(payload.payload.username)
            answerQueue = answerQueue
         }
      )

      // received the first time this user joins
      channel.on('broadcast',{event: 
         'sharePlayerList'},
         (payload) => {
            if(playerList.length > 1) return
            playerList = payload.payload.playerList
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
            sounds.ping.play()
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
      let id = Math.floor(Math.random()*100)
      myInfo = {
         username: newUsername,
         ID: id,
         color: myColor,
         score: 0
      }

      channel.subscribe((status) => {
         if (status !== 'SUBSCRIBED') return null
         
         channel.send({type: 'broadcast',event: 
            'playerJoin',
            payload: { info: myInfo },
         })
      })

      isLogin = true
      playerList.push(myInfo)
      playerList = playerList
   }

   function pushButton(){
      sounds.ping.play()
      if(isPushed || isLocked) return
      isPushed = true
      channel.send({type: 'broadcast',event: 
         'pushButton',
         payload: { username: myInfo.username },
      })
   }

   function addLog(message: string) {
      logs.push(message)
      logs = logs
   }

   onDestroy(()=>{
      supabase.removeChannel(channel)
      channel.send({type: 'broadcast', event: 
         'playerLeave',
         payload: { ID: myInfo?.username },
      })
      isLogin = false
   })
</script>

{#if isLogin}
   <h1>Welcome, {myInfo?.username}!</h1>

   <div class="flex flex-col items-center">
      <div class="btn btn-circle w-60 h-60 text-4xl btn-outline" class:btn-disabled={isPushed || isLocked} class:btn-warning={isPushed} class:btn-success={!isPushed && !isLocked} on:click={pushButton}>
         {isLocked?'LOCK': !isPushed? 'READY': answerQueue[0] === myInfo.username? 'Answer!':'Wait'}
      </div>

   </div>

   <div class="flex flex-row gap-2 top-y-10 h-20 items-center bg-slate-800 w-full">
      {#each playerList as p}
         <div class="btn-group mx-2">
            <div class="btn btn-success">{p.username}</div> 
            <div class="btn btn-outline">{p.score}</div>
         </div>
      {/each}
   </div>

   <div class="max-h-60 overflow-y-scroll">
      <h3>Logs</h3>
      <ul>
         {#each logs as l}
            <li>{l}</li>
         {/each}
      </ul>
   </div>

   <h3>Answer Queue</h3>
   <ul>
      {#each answerQueue as a}
         <li>{a}</li>
      {/each}
   </ul>
{:else}
   <div class="flex flex-col items-center gap-y-6">
      <h1>Choose your username</h1>
         <input class="input input-bordered text-3xl w-80 justify-center text-{colors[myColor]}-content bg-{colors[myColor]}" type="text" bind:value={newUsername}>

      <h1>Player Color</h1>

      <div class="flex flex-row gap-2">
         {#each colors as c, index}
            <button class="btn btn-square gap-2 btn-{c}" class:btn-outline={index != myColor} on:click={()=>myColor = index}/>
         {/each}
      </div>

      <button class="btn btn-xl btn-success btn-" on:click={login}>Join</button>
   </div>
{/if}


