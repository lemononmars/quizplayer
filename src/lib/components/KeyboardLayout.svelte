<script lang=ts>
   import { isLower, isUpper } from '$lib/utils/thaiwords';

   // stolen from https://github.com/narze/thwordle/blob/main/src/lib/layouts.ts
   import { createEventDispatcher } from 'svelte'
   const dispatch = createEventDispatcher();
   let isShift: boolean = false

	function type(row: number, col: number) {
      const letter = isShift? layout.rowsShifted[row][col] : layout.rows[row][col]

      if(letter === "⇧") {
         isShift = !isShift
         return
      }

      // release shift after each letter
      if(isShift)
         isShift = false
		dispatch('type', letter)
	}

   const layout = {
      rows: [
         ["ภ", "ถ", "ุ", "ึ", "ค", "ต", "จ", "ข", "ช", "⬅"],
         ["ไ", "ำ", "พ", "ะ", "ั", "ี", "ร", "น", "ย", "บ", "ล"],
         ["ฟ", "ห", "ก", "ด", "เ", "้", "่", "า", "ส", "ว", "ง"],
         ["⇧", "ผ", "ป", "แ", "อ", "ิ", "ื", "ท", "ม", "ใ", "ฝ"],
      ],
      rowsShifted: [
         ["ภ", "ถ", "ู", "ึ", "ค", "ต", "จ", "ข", "ช", "⬅"],
         ["ไ", "ฎ", "ฑ", "ธ", "ั", "๊", "ณ", "น", "ญ", "ฐ", "ล"],
         ["ฤ", "ฆ", "ฏ", "โ", "ฌ", "็", "๋", "ษ", "ศ", "ซ", "ง"],
         ["⇧", "ผ", "ป", "ฉ", "ฮ", "ิ", "์", "ท", "ฒ", "ฬ", "ฝ"],
      ],
   }
</script>

{#each layout.rows as r, ridx}
   <div class="flex flex-row gap-1 my-1">
      {#each r as key, kidx}
         {@const shiftKey = layout.rowsShifted[ridx][kidx]}
         <div 
            class="relative rounded-md border-2 flex-grow h-8 text-2xl hover:bg-success"
            on:click={()=> type(ridx, kidx)}
            class:bg-success={key === '⇧' && isShift}
         >
            {#if !isShift && key !== shiftKey}
               <div 
                  class="absolute top-0 left-0 text-sm" 
                  class:translate-x-2={isUpper(key) || isLower(key)}
               >
                  {isShift? key : shiftKey}
               </div>
            {/if}
            <p 
               class:translate-x-2={isUpper(key) || isLower(key) || key === 'ำ'}
               class:translate-y-2={isUpper(key)}
               class:-translate-y-2={isLower(key)}
            >
               {isShift? shiftKey : key}
            </p>
         </div>
      {/each}
   </div>
{/each}


<style>
	@keyframes pressed {
		20% {
			background-color: hsl(var(--su));
      }
		80% {
			background-color: none;
		}
	}
	.typed {
		animation-duration: 0.5s;
		animation-fill-mode: both;
		animation-name: pressed;
		animation-play-state: running;
	}
</style>