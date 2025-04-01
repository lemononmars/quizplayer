<script lang=ts>
   import {create} from 'simple-drawing-board'
   import { onMount, createEventDispatcher } from 'svelte';
	import { CheckCircleIcon, PenToolIcon, XCircleIcon } from 'svelte-feather-icons';

   let canvas: HTMLCanvasElement
   let drawingBoard: any // canvas
   let drawing: boolean = true
   let submitted: boolean = false

   const dispatch = createEventDispatcher();

   onMount(()=>{
      drawingBoard = create(canvas)
      drawingBoard.setLineSize(5)
      drawingBoard.setLineColor('white')
   })

   function submitImage() {
      submitted = true
      dispatch('submitImage', {
         image: drawingBoard.toDataURL()
      })
   }

   function drawingMode(mode: boolean) {
      if(mode && drawingBoard.mode === 'erase') {
         drawing = true
         drawingBoard.toggleMode()
         drawingBoard.setLineSize(5)
      }
      else if(!mode && drawingBoard.mode === 'draw') {
         drawing = false
         drawingBoard.toggleMode()
         drawingBoard.setLineSize(20)
      }
   }
</script>

<div 
   class="flex flex-col items-center justify-center w-screen m-2"
>
   <canvas bind:this={canvas} class="border-2" width=500 height=300/>
   {#if !submitted}
      <div class="btn-group">
         <div 
            class="btn" 
            class:btn-outline={!drawing} 
            on:click={()=>drawingMode(true)} 
            on:keypress={()=>{}}>
            <PenToolIcon size=20/>
         </div>
         <div 
            class="btn btn-outline" 
            class:btn-outline={drawing} 
            on:click={()=>drawingMode(false)} 
            on:keypress={()=>{}}
         >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eraser" viewBox="0 0 16 16">
               <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293z"/>
            </svg>
         </div>
         <div class="btn btn-outline btn-warning" on:click={()=>drawingBoard.clear()} on:keypress={()=>{}}>
            <XCircleIcon/>
         </div>
         <div class="btn btn-success" on:click={submitImage} on:keypress={()=>{}}>
            <CheckCircleIcon/>
         </div>
      </div>
   {/if}
</div>