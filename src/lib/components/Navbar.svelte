<script lang=ts>
   import logo from '$lib/images/logo.png'
   import {HomeIcon, CalendarIcon, PlayCircleIcon, InfoIcon, ChevronDownIcon, ChevronUpIcon, SettingsIcon} from 'svelte-feather-icons'
   import {username} from '$lib/store'

   const icons = [HomeIcon, CalendarIcon, PlayCircleIcon, InfoIcon]
   const menus = ['Home', 'Events', 'Puzzles', 'About']
   const links = ['', 'events', 'puzzles', 'about']

   let hideBar = false
   let openModal = false
</script>

<div class="navbar w-screen hidden lg:flex bg-success-content h-10 py-2">
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
      <div class="btn btn-circle hover:animate-spin" on:click={()=>openModal = true}>
         <SettingsIcon size=2x />
      </div>
   </div>
</div>

<!-- bottom nav bar for mobile-->
<div 
   class="navbar w-screen flex lg:hidden bg-base-content h-20 py-2 relative transition-transform"
   class:translate-y-20={hideBar}
>
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

   <div class="absolute top-0 left-0 -translate-y-full">
      <div class="btn btn-xs bg-base-content text-primary" on:click={()=>hideBar = !hideBar}>
         {#if hideBar}
            <ChevronUpIcon/>
         {:else}
            <ChevronDownIcon/>
         {/if}
      </div>
   </div>
</div>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="submit-modal" class="modal-toggle"/>
<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="modal cursor-pointer w-screen" class:modal-open={openModal}>
   <label class="modal-box relative flex flex-col justify-center" for="">
      <h1>ตั้งค่า</h1>
      <div class="grid grid-cols-2">
         <h3 class="text-xl font-bold p-2">ชื่อ</h3>
         <input class="input input-bordered" type="text" bind:value={$username}>
      </div>
      <div class="btn btn-success mx-auto" on:click={()=>openModal = false}>บันทึก</div>
   </label>
</label>