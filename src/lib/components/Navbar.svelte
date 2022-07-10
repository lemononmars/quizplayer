<script lang=ts>
   import logo from '$lib/images/logo.png'
   const menus = ['Home', 'Events', 'Puzzles', 'About']
   const links = ['', 'events', 'puzzles', 'about']
</script>

<div class="navbar t-0 w-screen hidden lg:flex bg-base-content h-10 py-2">
   <div class="navbar-start">
      <a href="/"><img class="h-10 aspect-square" src={logo} alt="logo"></a>
   </div>
   <div class="navbar-center gap-2 ">
      {#each menus as _, idx}
         <a href="/{links[idx]}">
            <p class="text-base hover:translate-y-1 transition-transform">{menus[idx]}</p>
         </a>
      {/each}
   </div>
   <div class="navbar-end gap-2 ">
      Hi
   </div>
</div>

