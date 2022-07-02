<script lang=ts>
   import {splitWord, isUpper, isLower} from '$lib/utils/thaiwords'
   import {fade} from 'svelte/transition'
   import { onMount } from 'svelte';
   export let word: string = 'ว่าง'

   const splittedWord = splitWord(word)
   let splittedIndex = splittedWord.map(s => 0)
   const numLetters = word.length
   const numBlocks = splittedWord.length

   let activeLetterIndex: number = 0
   let revealedLetters: boolean[] = Array(word.length).fill(false)
   let letterElement = Array(word.length).fill(null)

   let solved: boolean = false
   // splitted by unit 

   let currentLength = 0
   for(let i = 0; i < numBlocks; i ++) {
      splittedIndex[i] = currentLength
      currentLength += splittedWord[i].length
   }

   let revealPeriod = 2000
   let time = numLetters
   let timer: any

   onMount(async ()=> {
      timer = setInterval(()=> {
         time --
         setActiveLetter(Math.floor(Math.random()*numLetters))
         reveal(nextHiddenLetter())

         if(time <= 0)
            clearInterval(timer)
      }
         ,revealPeriod
      )
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

   let isPaused: boolean = false

   function pause() {
      isPaused = true
      clearInterval(timer)
   }

   function play() {
      isPaused = false
      timer = setInterval(()=> {
         time --
         setActiveLetter(Math.floor(Math.random()*numLetters))
         reveal(nextHiddenLetter())

         if(time <= 0)
            clearInterval(timer)
      }
         ,revealPeriod
      )
   }
</script>

<svelte:window on:keydown={handleKeyPress}/>

<div class="radial-progress mx-auto" style="--value:{time*100/numLetters};">
   <span class="countdown">
      <span style="--value:{time};"></span>
    </span>
</div>

<div class="my-20 w-full flex flex-row gap-1 justify-center">
   {#each splittedWord as word, widx}
      <div class="w-12 relative">
         {#each word as l, idx}
            {@const letterIndex = splittedIndex[widx] + idx}
            <div 
               class="absolute {isLower(l) ? 'top-12': isUpper(l) ? (idx > 0 && isUpper(word[idx-1]) ? '-top-12' : '-top-6') : 'top-0'} left-0 w-full {isLower(l) || isUpper(l) ? 'h-6' : 'h-12'} border-2"
               class:bg-success={revealedLetters[letterIndex]}
               bind:this={letterElement[letterIndex]}
               on:click={()=>reveal(letterIndex)}
            >
               {#if revealedLetters[letterIndex]}
                  {#if isLower(l)}
                     <p class="-translate-y-8 translate-x-2 text-4xl" transition:fade>{l}</p>
                  {:else if isUpper(l)}
                     <p class="translate-x-2 text-4xl" transition:fade>{l}</p>
                  {:else}
                     <p class="text-4xl" transition:fade>{l}</p>
                  {/if}
               {/if}
            </div>
         {/each}
      </div>
   {/each}
</div>

{#if isPaused}
   <div class="btn btn-info" on:click={play}>
      Continue!
   </div>
{:else}
   <div class="btn btn-error" on:click={pause}>
      Pause!
   </div>
{/if}