<script lang=ts>
   import {onMount, onDestroy} from 'svelte'
   
   let channel: any, pusher: any
   let pusherKey = String(import.meta.env.VITE_PUSHER_KEY)
   // Enable pusher logging - don't include this in production
   
   onMount(async()=>{
      Pusher.logToConsole = true;

      pusher = new Pusher(pusherKey, {
         cluster: 'ap1'
      });

      channel = pusher.subscribe('battle-channel');

      // receive event
      channel.bind('initialize', function(data: any) {
         message = JSON.stringify(data)
         alert('first!');
      });

      channel.bind('res-send-message', function(data: any) {
         message = JSON.stringify(data)
         alert('got new message!');
      });

      channel.bind('res-new-player', function(data: any) {
         message = JSON.stringify(data)
         alert('someone just join!');
      });
   })

   // send event
   async function pushData() {
      const res = await fetch('/api/post/pusher', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            action: 'submit',
            data: count
         }),
      });

      if (!res.ok)
         console.error('failed to push data because', JSON.stringify(res.body));
      else {
         count = count + 1
         console.log(count)
      }
   }

   onDestroy(()=>{
      if(pusher)
         pusher.unsubscribe('battle-channel');
   })

   let message: string = 'none'
   let count = 1 
   $: btnString = 'send ' + count
</script>

<svelte:head>
   <script src="https://js.pusher.com/7.2/pusher.min.js"></script>
</svelte:head>

<h1>Receiving.... {message}</h1>

<div class="btn" on:click={pushData}>{btnString}</div>