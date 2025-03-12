<script lang=ts>
   import {onMount, onDestroy} from 'svelte'
   import {fade} from 'svelte/transition'
   import {loadSounds, type soundType} from '$lib/sounds/'
   import {VolumeXIcon, Volume2Icon} from 'svelte-feather-icons'
   //import {Head} from '$lib/components'

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
   let isLoggedIn: boolean = false
   let isPushed: boolean = false
   let isLocked: boolean = false
   let logs: string[] = []
   let answerQueue: string[] = []
   let wager: number = 0
   let answer: string = ''

   let soundOn: boolean = true
   let sounds: any = []
   $: statusText = isLocked? 'LOCK': !isPushed? 'READY': answerQueue[0] === myInfo.username? 'Answer!':'Wait'

   let playerList: PlayerInfo[] = []
   let newUsername: string = $username || ''
   
   interface PlayerInfo {
      username: string,
      color: number,
      score: number,
      wager?: number,
      answer?: string,
      result?: boolean
   }

   onMount(async()=>{
      sounds = loadSounds()

      channel.on('broadcast',{ event: 
         'toggleLockButton' },
         () => { 
            isLocked = !isLocked
            addLog('button ' + (isLocked?'':'un') + 'locked!')
            if(!isLocked)
               playSound('ping')
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
            if(username === myInfo.username)
               myInfo.score += score
            playerList = playerList
            if(score > 0) {
               isPushed = false
               answerQueue = []
               playSound('correct')
            }
            else {
               answerQueue.shift()
               answerQueue = answerQueue
               if (score < 0)
                  playSound('incorrect')
               else
                  playSound('timesup')
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
      let id = Math.floor(Math.random()*100)
      myInfo = {
         username: newUsername,
         color: myColor,
         score: 0,
      }

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
      playSound('ping')
      if(isPushed || isLocked) return
      isPushed = true
      channel.send({type: 'broadcast',event: 
         'pushButton',
         payload: { username: myInfo.username },
      })
   }

   function submitWager() {
      if(wager == 0) return

      channel.send({type: 'broadcast',event: 
         'submitWager',
         payload: { username: myInfo.username, wager },
      })
      wager = 0
   }

   function submitAnswer() {
      channel.send({type: 'broadcast',event: 
         'submitAnswer',
         payload: { username: myInfo.username, answer },
      })
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

   onDestroy(()=>{
      channel.send({type: 'broadcast', event: 
         'playerLeave',
         payload: { username: myInfo?.username },
      })
      supabase.removeChannel(channel)
      isLoggedIn = false
   })
</script>

<!-- <Head {title}/> -->

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

      <label for="wager-modal" class="btn btn-outline btn-secondary btn-sm">Wager</label>
      <label for="text-modal" class="btn btn-outline btn-secondary btn-sm">Type answer</label>
   </div>

   <div class="flex flex-col items-center">
      <div 
         class="btn btn-circle w-60 h-60 text-4xl btn-outline m-8" 
         class:btn-disabled={isPushed || isLocked} 
         class:btn-warning={isPushed} 
         class:btn-success={!isPushed && !isLocked} 
         on:click={pushButton}
         on:keypress={()=>{}}
      >
         {statusText}
      </div>

   </div> 

   <div class="flex flex-col md:flex-row gap-2 p-4 md:h-20 items-center bg-slate-800 w-full">
      {#each playerList as p} 
         <div class="btn-group mx-2">
            <div class="btn btn-sm md:btn-md btn-{colors[p.color]}">{p.username}</div> 
            <div class="btn btn-sm md:btn-md btn-outline">{p.score}</div>
         </div>
      {/each}
   </div>

   <h3>Answer Queue</h3>
   <ol>
      {#each answerQueue as a}
         <li>{a}</li>
      {/each}
   </ol>

   <input type="checkbox" id="wager-modal" class="modal-toggle" />
   <div class="modal">
   <div class="modal-box">
      <h3 class="font-bold text-lg">Choose your wager!</h3>
      <input type="range" bind:value={wager} 
         min="0" max={myInfo.score} step="10"
         class="range range-primary" /> 

      <div class="modal-action justify-between">
         <h3>${wager}</h3>
         <label for="wager-modal" class="btn btn-error" on:click={()=>wager=0} on:keypress={()=>{}}>Cancel</label>
         <label for="wager-modal" class="btn btn-success" on:click={submitWager} on:keypress={submitWager}>Bet ${wager}!</label>
      </div>
   </div>
   </div>

   <input type="checkbox" id="text-modal" class="modal-toggle" />
   <div class="modal">
   <div class="modal-box">
      <h3 class="font-bold text-lg">Input your answer!</h3>
      <input type="text text-outline" bind:value={answer} class="range range-primary" /> 

      <div class="modal-action">
         <label for="text-modal" class="btn btn-error" on:click={()=>answer=''} on:keypress={submitWager}>Cancel</label>
         <label for="text-modal" class="btn btn-success" on:click={submitAnswer} on:keypress={submitWager}>Submit!</label>
      </div>
   </div>
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
         <input class="input input-bordered text-3xl w-80 justify-center text-{colors[myColor]}-content bg-{colors[myColor]}" type="text" placeholder="username" bind:value={newUsername}>

      <h1>Choose player color:</h1>

      <div class="flex flex-row gap-2">
         {#each colors as c, index}
            <button class="btn btn-square gap-2 btn-{c}" class:btn-outline={index != myColor} on:click={()=>myColor = index}/>
         {/each}
      </div>

      <button class="btn btn-xl btn-success btn-" on:click={login}>Join</button>
   </div>
{/if}


