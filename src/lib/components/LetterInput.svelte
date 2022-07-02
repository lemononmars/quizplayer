<script lang=ts>
   import {splitWord, isUpper, isLower} from '$lib/utils/thaiwords'
   import {fade} from 'svelte/transition'
   import { onMount } from 'svelte';
   export let word: string = 'ว่าง'

   let activeLetterIndex: number = 0
   let revealedLetters: boolean[] = Array(word.length).fill(false)

   let solved: boolean = false

   let letterElement = Array(word.length).fill(null)
   //const splitted = splitWord(word)
   const splittedWord = word.split("")
   const numLetters = splittedWord.length

   const boxWidth = 10, boxHeight = 10, halfHeight = 4
   let posX = 0
   let letterPositions = Array(numLetters).fill({}).map(_=>({x:0, y:0, h: halfHeight}))

   /* v (x,y) = 0,0)
      upper 2  <- half
      upper 1  <- half
      base     <- box
      lower    <- half
   */ 
   for(let i = 0; i < numLetters; i ++) {
      const letter = splittedWord[i]
      letterPositions[i].x = posX 
      if(isLower(letter))
         letterPositions[i].y += (2*halfHeight + boxHeight)
      else if(isUpper(letter) && i > 0 && !isUpper(splittedWord[i-1])) {
         letterPositions[i].y += halfHeight
      }
      else {
         letterPositions[i].y += 2*halfHeight
         letterPositions[i].h = boxHeight
         posX += boxWidth
      }
   }

   let revealPeriod = 2000
   let time = numLetters
   let timer: any
   onMount(async ()=> {
      //setActiveLetter(0)

      timer = setInterval(()=> {
            time --
            activeLetterIndex = (Math.floor(Math.random()*numLetters))
            reveal(nextHiddenLetter())

            if(time <= 0)
               clearInterval(timer)
         }
      ,revealPeriod)
   })

   function setActiveLetter(index: number) {
      letterElement[activeLetterIndex].classList.remove('animate-pulse', 'border-info')
      activeLetterIndex = index
      letterElement[activeLetterIndex].classList.add('animate-pulse', 'border-info')
   }

   function nextHiddenLetter() {
      let offset = 1
      while(offset < numLetters) {
         const idx = (activeLetterIndex + offset) % numLetters
         if(!revealedLetters[idx]) {
            setActiveLetter(idx)
            break;
         }
         offset ++
      }

      if(offset == numLetters)
         solved = true
      
      return activeLetterIndex
   }

   function handleKeyPress(event: KeyboardEvent) {
		if (event.code === "Tab" || event.code === 'Space' || event.code === 'ArrowRight') 
         nextHiddenLetter()
      else if (event.code === 'Enter') {
         reveal(activeLetterIndex) 
         nextHiddenLetter()
      }
      else if (event.code === 'ArrowLeft')
         setActiveLetter((activeLetterIndex + numLetters - 1) % numLetters)
	}

   function reveal(index: number){
      revealedLetters[index] = true
   }
</script>

<svelte:window on:keydown|preventDefault={handleKeyPress}/>

{time}

<div class="my-10 relative w-screen h-24 flex flex-row gap-1">
   {#each splittedWord as l, idx}
      <!-- <div 
         class="absolute top-0 left-0 translate-y-{letterPositions[idx].y} translate-x-[{letterPositions[idx].x} w-10 h-{letterPositions[idx].h} border-2 border-primary"
         class:bg-primary={!revealedLetters[idx]}
         bind:this={letterElement[idx]}
         on:click={()=>reveal(idx)}
      >
         {#if revealedLetters[idx]}
            {#if isLower(l)}
               <p class="-translate-y-6 translate-x-2 text-3xl" transition:fade>{l}</p>
            {:else if isUpper(l)}
               <p class="translate-x-1 text-3xl" transition:fade>{l}</p>
            {:else}
               <p class="text-3xl" transition:fade>{l}</p>
            {/if}
         {/if}
      </div>  -->
      <div 
         class="w-10 h-{letterPositions[idx].h} border-2 border-primary"
         class:bg-primary={!revealedLetters[idx]}
         bind:this={letterElement[idx]}
         on:click={()=>reveal(idx)}
      >
         {#if revealedLetters[idx]}
            {#if isLower(l)}
               <p class="-translate-y-6 translate-x-2 text-3xl" transition:fade>{l}</p>
            {:else if isUpper(l)}
               <p class="translate-x-1 text-3xl" transition:fade>{l}</p>
            {:else}
               <p class="text-3xl" transition:fade>{l}</p>
            {/if}
         {/if}
      </div> 
   {/each}
</div>