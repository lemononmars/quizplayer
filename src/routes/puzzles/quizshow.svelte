<script lang=ts>
   import {onMount, onDestroy} from 'svelte'
   import {KeyIcon} from 'svelte-feather-icons'
   
   import { createClient } from '@supabase/supabase-js'
   const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

   const channel = supabase.channel('quiz', {
      config: { broadcast: { self: true} },
   })

   let myID = ''
   let newID = ''
   let lastText: string = '-'
   let playerList: string[] = []

   function messageReceived(payload) {
      lastText = payload.payload.message
   }

   function addPlayer(payload) {
      const newPlayerID = payload.payload.ID
      playerList.push(newPlayerID)
      playerList = playerList
   }

   function removePlayer(payload) {
      const leftPlayerID = payload.payload.ID
      playerList = playerList.filter(i => i !== leftPlayerID)
      playerList = playerList
   }


   onMount(async()=>{
      myID = 'Player#' + Math.floor(Math.random()*100)

      channel.on(
         'broadcast',
         { event: 'buttonpushed' },
         (payload) => messageReceived(payload)
      )

      channel.on(
         'broadcast',
         { event: 'playerJoin' },
         (payload) => addPlayer(payload)
      )

      channel.on(
         'broadcast',
         { event: 'playerLeave' },
         (payload) => removePlayer(payload)
      )

      channel.on(
         'broadcast',
         { event: 'playerRename' },
         (payload) => removePlayer(payload)
      )

      channel.subscribe((status) => {
         if (status !== 'SUBSCRIBED') return null
         
         channel.send({
            type: 'broadcast',
            event: 'playerJoin',
            payload: { ID: myID },
         })
      })
   })

   function pushData(){
      channel.send({
         type: 'broadcast',
         event: 'buttonpushed',
         payload: { message: myID + " pushed!" },
      })
   }

   function rename() {
      channel.send({
         type: 'broadcast',
         event: 'playerRename',
         payload: { old: myID, new: newID},
      })
      myID = newID
   }  

   onDestroy(()=>{
      supabase.removeChannel(channel)
      channel.send({
         type: 'broadcast',
         event: 'playerLeave',
         payload: { ID: myID },
      })
   })
</script>

<h1>Hello! {myID}</h1>

<div class="input-group w-80 m-auto">
   <div class="btn btn-accent no-animation"><KeyIcon size=20/></div>
   <input class="input input-bordered text-3xl w-full transition-colors" type="text" bind:value={newID}>
   <div class="btn btn-primary" on:click={rename}>แก้</div>
</div>

<h2>Action: {lastText}</h2>

<div class="btn btn-circle w-40 h-40 text-xl btn-outline btn-error" on:click={pushData}>PUSH</div>

<h3> Players</h3>

{#each playerList as p}
   <div class="btn btn-outline btn-success mx-2">{p}</div>
{/each}
