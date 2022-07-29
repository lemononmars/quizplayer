<script lang=ts>
   import type { IPuzzleCrossword, CrosswordClue } from "$lib/interfaces";
   import {splitWord, isLegal, appendable} from "$lib/utils/thaiwords"
   import KeyboardLayout from '$lib/components/KeyboardLayout.svelte'

   import TitleTab from "$lib/components/TitleTab.svelte";
   import {onMount} from 'svelte'
   import { ChevronLeftIcon, ChevronRightIcon } from "svelte-feather-icons";

   interface Clue extends CrosswordClue {
      index?: number,
      solved?: boolean
   }

   export let content: IPuzzleCrossword
   let clues: Clue[] = content.clues

   const sizeStr = content.size[0] >= 6 ? 'w-10 h-10' : 'w-20 h-20'
   const letterSize = content.size[0] >= 6 ? 'text-xl' : 'text-5xl'

   // add indices to the clues by sorting it from top-left to bottom-right
   let sortedPositions = content.clues.map((c, idx) => [idx, c.position[0], c.position[1]])
      .sort((a,b)=>{
         if(a[2] - b[2] != 0) return a[2] - b[2]
         return a[1] - b[1]
      })

   let gridIndex = 1
   for(let i = 0; i < sortedPositions.length; i ++) { 
      if(i > 0)
         if((sortedPositions[i-1][2] != sortedPositions[i][2]) || (sortedPositions[i-1][1] != sortedPositions[i][1])) {
            gridIndex ++
         }
      clues[sortedPositions[i][0]].index = gridIndex
   }

   clues = clues.sort((a,b)=> {
      if(a.direction === b.direction)
         return a.index - b.index 
      else if(a.direction === 'down')
         return -1
      else
         return 1
   })

   let solvedClues: boolean[] = clues.map(_=> false)
   let solved: boolean
   let openModal: boolean = false

   type Cell = [number, number]
   type Direction = 'down' | 'across'

   let activeCell: Cell = [0,0]
   let activeClue: Clue = clues[0]
   const gridWidth = content.size[0]
   const gridHeight = content.size[1]

   onMount(async()=>{
      toggle(activeClue)
      selectPosition(activeClue.position)
   })

   let grid = Array(gridHeight).fill('')
      .map(_ => (Array(gridWidth).fill('')
         .map(_ =>({
            input: '',
            solution: '',
            mark: '',
            down: -1,
            across: -1,
            locked: false
         }))
      ))

   let gridElem = Array(gridHeight).fill('')
      .map(_ => (Array(gridWidth).fill('')
         .map(_ => null)
      ))

   // Tranpose the matrix
   clues.forEach(c => {
      const downMult = c.direction === 'down' ? 1 : 0
      const acrossMult = 1 - downMult 
      splitWord(c.answer).forEach((letter, idx) => {
         grid[c.position[0] + idx * acrossMult][c.position[1] + idx * downMult].solution = letter
         c.direction === 'down' ? 
            grid[c.position[0]][c.position[1] + idx].down = c.index
            : grid[c.position[0] + idx][c.position[1]].across = c.index
      })
   })

   clues.forEach(c => 
      grid[c.position[0]][c.position[1]].mark = '' + c.index
   )

   // end initiation

   function selectClue(c: Clue){
      toggleHighlight(c)
      activeClue = c
      changeActiveCell(c.position)
   }

   function toggleHighlight(c: Clue) {
      toggle(activeClue)
      toggle(c)
   }

   function toggle(c: Clue) {
      const downMult = c.direction === 'down' ? 1 : 0
      const acrossMult = 1 - downMult
      splitWord(c.answer).forEach((_, idx) =>{
         if(!grid[c.position[0] + idx * acrossMult][c.position[1] + idx * downMult].locked)
            gridElem[c.position[0] + idx * acrossMult][c.position[1] + idx * downMult].classList.toggle('bg-info-content')
      })
   }

   function selectPosition(position: Cell) {
      const {down, across} = grid[position[0]][position[1]]
      let newClue
      let findDown: boolean = (activeClue.direction === 'across') // bias toward a different direction

      if(down > -1)
         findDown = true
      else
         findDown = false

      // special case: when user clicks on the same cell twice, we assume they want to change the direction
      if(position[0] == activeCell[0] && position[1] == activeCell[1] && down > -1 && across > -1)
         findDown = (activeClue.direction === 'across')

      newClue = findDown ? clues.filter(c=>c.direction === 'down' && c.index == down)[0] 
         : clues.filter(c=>c.direction === 'across' && c.index == across)[0]

      toggleHighlight(newClue)
      activeClue = newClue
      changeActiveCell(position)
   }

   function nextCell() {
      if(activeClue.direction === 'down') 
         if(activeCell[1] < gridHeight -1 && grid[activeCell[0]][activeCell[1]+1].solution !== '')
            changeActiveCell([activeCell[0], activeCell[1] + 1])
         else
            nextClue()
      else 
         if(activeCell[0] < gridWidth -1 && grid[activeCell[0]+1][activeCell[1]].solution !== '')
            changeActiveCell([activeCell[0] + 1, activeCell[1]])
         else
            nextClue()
   }

   function prevCell() {
      if(activeClue.direction === 'down') 
         if(activeCell[1] > 0 && grid[activeCell[0]][activeCell[1]-1].solution !== '')
            changeActiveCell([activeCell[0], activeCell[1] - 1])
         else
            prevClue()
      else 
         if(activeCell[0] > 0 && grid[activeCell[0]-1][activeCell[1]].solution !== '')
            changeActiveCell([activeCell[0] - 1, activeCell[1]])
         else
            prevClue()
   }

   function moveTo(x: number,y: number) {
      if(activeCell[1] + y < gridHeight && activeCell[1] + y >= 0 
         && activeCell[0] + x < gridWidth && activeCell[0] + x >= 0 
         && grid[activeCell[0] + x][activeCell[1] + y].solution !== '')
         selectPosition([activeCell[0] + x, activeCell[1] + y])
      // if it fails, do nothing
   }

   function nextClue() {
      const nextActiveClue = clues[(getClueIndex(activeClue) + 1) % clues.length]
      selectClue(nextActiveClue)
   }

   function prevClue() {
      const nextActiveClue = clues[(getClueIndex(activeClue) + clues.length - 1) % clues.length]
      selectClue(nextActiveClue)
   }

   function getClueIndex(c: Clue) {
      for(let i = 0; i < clues.length; i ++)
         if(c.index == clues[i].index && c.direction === clues[i].direction)
            return i
      // should never happen, but just in case
      return 0
   }

   function getClue(dir: Direction, index: number) {
      for(let i = 0; i < clues.length; i ++)
         if(clues[i].direction === dir && clues[i].index === index)
            return clues[i]
      return null
   }

   function handleKeyPress(event: KeyboardEvent) {
      // navigation
      if(event.code === "Space")
		   nextCell()
      else if(event.code === "Tab")
         nextClue()
      else if(event.code === 'ArrowDown')
         moveTo(0,1)
      else if (event.code === 'ArrowUp')
         moveTo(0,-1)
      else if (event.code === 'ArrowRight')
         moveTo(1,0)
      else if (event.code === 'ArrowLeft')
         moveTo(-1,0)
      else if(grid[activeCell[0]][activeCell[1]].locked)
         return 
      
      // modifying cells
      if(event.code === 'Backspace') {
         if(grid[activeCell[0]][activeCell[1]].input)
            grid[activeCell[0]][activeCell[1]].input = ''
         else
            prevCell()
      }
      else
         modifyCell(event.key)
      // else 
      //    alert("ลืมเปลี่ยนภาษาหรือเปล่า?")
   }

   function modifyCell(letter: string) {
      if(appendable(grid[activeCell[0]][activeCell[1]].input, letter))
         grid[activeCell[0]][activeCell[1]].input += letter
      else if(isLegal(letter)) {
         if(grid[activeCell[0]][activeCell[1]].input)
            nextCell()
         grid[activeCell[0]][activeCell[1]].input = letter
      }
      checkAnswer(activeCell)
   }

   // event from KeyboardLayout component
   function handleType(event: any){
      const letter = event.detail
      if(letter === '⬅')
         if(grid[activeCell[0]][activeCell[1]].input)
            grid[activeCell[0]][activeCell[1]].input = ''
         else
            prevCell()
      else
         modifyCell(letter)
   }

   function changeActiveCell(position: Cell){
      gridElem[activeCell[0]][activeCell[1]].classList.remove('bg-warning-content', 'animate-pulse')
      activeCell = [position[0], position[1]]
      gridElem[activeCell[0]][activeCell[1]].classList.add('bg-warning-content', 'animate-pulse')
   }

   function checkAnswer(position: Cell){
      if(solved) return
      const {down, across} = grid[position[0]][position[1]]
      if(down > -1)
         checkAnswerClue(getClue('down', down))
      if(across > -1)
         checkAnswerClue(getClue('across', across))

      if(solvedClues.every(c=>c)) {
         solved = true
         gridElem[activeCell[0]][activeCell[1]].classList.remove('border-primary-content', 'animate-pulse')
         openModal = true
      }
   }

   function checkAnswerClue(c: Clue | null) {
      if(!c) return
      let match = true
      const downMult = c.direction === 'down' ? 1 : 0
      const acrossMult = 1 - downMult
      splitWord(c.answer).forEach((letter, idx) =>{
         match = match && (grid[c.position[0] + idx * acrossMult][c.position[1] + idx * downMult].input === letter)
      })
      if(match) {
         solvedClues[getClueIndex(c)] = true
         splitWord(c.answer).forEach((_, idx) =>{
            grid[c.position[0] + idx * acrossMult][c.position[1] + idx * downMult].locked = true
            gridElem[c.position[0] + idx * acrossMult][c.position[1] + idx * downMult].classList.remove('bg-info-content')
         })
         nextClue()
      }
   }
</script>

<svelte:window on:keydown|preventDefault={handleKeyPress}/>

<TitleTab {content}/>

<div class="flex flex-col lg:flex-row mt-10">
   <div class="text-center w-full lg:w-1/2 ">
      <div class="flex flex-col">
         {#each grid as rows, ridx}
            <div class="flex flex-row mx-auto">
               {#each rows as _, cidx}
                  {#if grid[cidx][ridx].solution === ''}
                     <div class="{sizeStr} border-2 bg-base-content"></div>
                  {:else}
                     <div class="relative {sizeStr}" on:click={()=>selectPosition([cidx, ridx])}>
                        <div 
                           class="w-full h-full border-2 text-center grid place-content-center"
                           class:bg-success-content={grid[cidx][ridx]?.locked}
                           bind:this={gridElem[cidx][ridx]}
                        >
                           <p 
                              class="text-base-content {letterSize}"
                              class:font-bold={grid[cidx][ridx]?.locked}
                              class:text-success={grid[cidx][ridx]?.locked}
                              >{grid[cidx][ridx].input}</p
                           >
                        </div>
                        {#if grid[cidx][ridx].mark}
                           <div class="absolute top-0 left-0 pl-2 z-10">
                              <p class="text-xl">{grid[cidx][ridx].mark}</p>
                           </div>
                        {/if}
                     </div>
                  {/if}
               {/each}
            </div>
         {/each}
      </div>
      <div class="flex flex-row justify-between items-center">
         <div class="btn" on:click={prevClue}>
            <ChevronLeftIcon/>
         </div>
         <h1 class="mx-auto">{activeClue.index}) {activeClue.clue}</h1>
         <div class="btn" on:click={nextClue}>
            <ChevronRightIcon/>
         </div>
      </div>
   </div>
   <div class="hidden lg:block text-left w-full lg:w-1/2 p-4 h-full overflow-y-auto">
      <h3>แนวตั้ง</h3>
      <ul class="list-none">
      {#each clues as c, idx} 
         {#if c.direction === 'down'}
            <li class:bg-neutral-content={activeClue.index == c.index && activeClue.direction === 'down'} class="bg-opacity-20">
               <a on:click={()=>selectClue(c)}>
                  <p class:opacity-40={solvedClues[idx]}>{c.index}) {c.clue}</p>
               </a>
            </li>
         {/if}
      {/each}
      </ul>
      <h3>แนวนอน</h3>
      <ul class="list-none">
      {#each clues as c, idx}
         {#if c.direction === 'across'}
            <li class:bg-neutral-content={activeClue.index == c.index && activeClue.direction === 'across'} class="bg-opacity-20">
               <a on:click={()=>selectClue(c)}>
                  <p class:opacity-40={solvedClues[idx]}>{c.index}) {c.clue}</p>
               </a>
            </li>
         {/if}
      {/each}
      </ul>
   </div>

   <div class="block lg:hidden">
      <KeyboardLayout on:type={handleType}/>
   </div>
</div>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="submit-modal" class="modal-toggle"/>
<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="modal cursor-pointer w-full" class:modal-open={openModal} on:click={()=>openModal = false}>
   <label class="modal-box relative" for="">
      <h3 class="text-xl font-bold m-2">สุดยอด! แก้ปริศนาอักษรไขว้ครบแล้ว 🎉</h3>
      <div class="btn btn-block btn-outline" on:click={()=>openModal = false}>เย่!</div>
   </label>
</label>