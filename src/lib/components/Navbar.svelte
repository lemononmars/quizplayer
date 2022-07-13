<script lang=ts>
   import logo from '$lib/images/logo.png'
   import {HomeIcon, CalendarIcon, PlayCircleIcon, InfoIcon} from 'svelte-feather-icons'
   const icons = [HomeIcon, CalendarIcon, PlayCircleIcon, InfoIcon]
   const menus = ['Home', 'Events', 'Puzzles', 'About']
   const links = ['', 'events', 'puzzles', 'about']
</script>

<div class="navbar w-screen hidden lg:flex bg-base-content h-10 py-2">
   <div class="navbar-start">
      <a href="/">
         <img class="h-12 aspect-square hover:animate-spin" src={logo} alt="logo">
      </a>
   </div>
   <div class="navbar-center gap-8">
      {#each menus as _, idx}
         <a href="/{links[idx]}">
            <p class="text-base hover:translate-y-1 transition-transform">{menus[idx]}</p>
         </a>
      {/each}
   </div>
   <div class="navbar-end">
      Hii
   </div>
</div>

<div class="navbar w-screen flex lg:hidden bg-base-content h-20 py-2">
   <div class="navbar-center w-full">
      <div class="flex flex-row justify-around w-full mx-auto">
         {#each menus as _, idx}
            {#if idx != 0}
               <div class="text-secondary text-3xl">|</div>
            {/if}
            <a href="/{links[idx]}">
               <div class="flex flex-col justify-center hover:translate-y-1 transition-transform">
                  <svelte:component this={icons[idx]} size=30 class="mx-auto"/>
                  <p class="text-base">{menus[idx]}</p>
               </div>
            </a>
         {/each}
      </div>
   </div>
</div>
