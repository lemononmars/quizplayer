<script lang=ts>
   import { onMount } from 'svelte';

   export let answerImage: any
   let canvas: HTMLCanvasElement
   let ctx: any

   onMount(()=>{
      let image = new Image()
      image.src = answerImage

      image.onload = function() {
         ctx = canvas.getContext('2d')
         ctx.clearRect(0,0,500,300)
         ctx.drawImage(image, 0, 0)
      }
   })
</script>

<canvas bind:this={canvas} class="border-2" width=500 height=300/>