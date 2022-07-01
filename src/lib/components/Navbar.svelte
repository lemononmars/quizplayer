<script lang=ts>
   import logo from '$lib/images/logo.png'
   const menus = ['Home', 'News', 'Puzzles', 'About']
   const links = ['', 'news', 'puzzles', 'about']
</script>

<div class="navbar t-0 w-screen flex bg-base-content h-10 py-2">
   <div class="navbar-start">
      <a href="/"><img class="h-10 aspect-square" src={logo} alt="logo"></a>
   </div>
   <div class="navbar-center gap-2 ">
      {#each menus as _, idx}
         <a href="/{links[idx]}">
            <p class="text-base">{menus[idx]}</p>
         </a>
      {/each}
   </div>
   <div class="navbar-end gap-2 ">
      Hi
   </div>
</div>

