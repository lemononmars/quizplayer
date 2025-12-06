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

Are you looking for <a href="/button"><button class="btn">Quiz button</button></a> ?