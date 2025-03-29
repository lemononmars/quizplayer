<script lang=ts>
   enum State {
      'ENTER',
      'HOST',
      'PLAYER',
      'AUDIENCE'
   }

   let state = State.ENTER
</script>

<svelte:head>
   <title>Let's Quiz</title>
</svelte:head>

{#if state == State.ENTER} 
   <h1>Choose role</h1>
   <button class="btn" on:click={()=>state = State.HOST}>Host</button>
   <button class="btn" on:click={()=>state = State.PLAYER}>Play</button>
{:else if state === State.HOST}
   <h2>Choose game</h2>
   <button class="btn" on:click={()=>state = State.HOST}>Jeopardy</button>
{/if}