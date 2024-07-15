<script context=module lang=ts>
   import type {Leaderboard} from '$lib/interfaces'
	import { dateToThaiString } from '$lib/utils/date';
   export async function load({fetch, params}) {

      const {year} = params
      const res = await fetch('/api/leaderboard/weekly')
      const data: Leaderboard[] = await res.json()

      return {
         props: { 
            data: data.filter(d=>String(d.puzzle_id).startsWith(year)),
            year,
         },
         
      };
   }
</script>

<script lang=ts>
   export let data: Leaderboard[], year: number
   let curseason: number = 0 // 0 = all, 1,2,3,4 for weeks 1-13, 14-27, 28-38 and 39-52
   let min = data[0].puzzle_id%100
   let max = data[0].puzzle_id%100
   data.forEach(d=>{ 
         let temp = d.puzzle_id%100
         if(temp < min)
            min = temp
         if(temp > max)
            max = temp
      }
   )

   const minseason: number = Math.floor(min/13)+1
   const maxseason: number = Math.floor(max/13)+1
   let seasons: number[] = []
   for(let i = minseason; i <= maxseason; i ++)
      seasons.push(i)

   $: minweek = getMinWeek(curseason)
   $: maxweek = getMaxWeek(curseason)
   $: weekArray = Array(maxweek-minweek+1).fill(0).map((x, y) => y + minweek)
   
   const getMinWeek = function(s: number) {
      const absmin = (s === 0) ? 0:(s-1)*13 + 1
      return Math.max(absmin, min)
   }
   const getMaxWeek = function(s: number) {
      const absmax = (s === 0) ? 52:s*13
      return Math.min(absmax, max)
   }


   let names: string[] = []
   data.forEach(d => {
      let name = d.name
      if(!names.includes(name))
         names = [name, ...names]
   })

   $: sortedNames = names.filter(n => getTotal(n, minweek, maxweek) > 0).sort((a,b) => getTotal(b, minweek, maxweek) - getTotal(a, minweek, maxweek))

   function getTotal(n: string, a: number, b: number) {
      let sum = 0
      data.forEach(d => {
         if(d.name === n && d.puzzle_id%100 >= a && d.puzzle_id%100 <= b) 
            sum+= d.score
         }
      )
      return sum
   }

   function findScore(n: string, w: number) {
      const found = data.find(d=> d.name === n && d.puzzle_id%100 === w)
      if(!found)
         return 0
      else
         return found.score
   }
</script>

<h1>ตารางอันดับ ปริศนาประจำปี {year}</h1>

<ul class="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box">
   <li><a on:click={()=>{curseason = 0}} class="{curseason === 0? 'active':''}">รวม</a></li>
   {#each seasons as ss}
      <li><a on:click={()=>{curseason = ss}} class="{curseason === ss? 'active':''}">ฤดูกาลที่ {ss}</a></li>
   {/each}
 </ul>

<div class="overflow-x-auto overflow-y-auto h-screen">
   <table class="table table-zebra table-pin-rows table-pin-cols mx-auto border-collapse">
      <thead>
         <tr>
            <th>ชื่อ</th>
            <td>อันดับ</td>
            <td>คะแนนรวม</td>
            {#each weekArray as week}
               <td>สัปดาห์ที่ {week}</td>
            {/each}
         </tr>
      </thead>
      <tbody>
         {#each sortedNames as n, idx}
            <tr>
               <th class="text-nowrap max-w-40">{n}</th>
               <th>{idx+1}</th>
               <td>{getTotal(n, minweek, maxweek)}</td>
               {#each weekArray as week}
                  <td>{findScore(n,week)}</td>
               {/each}
            </tr>
         {/each}
      </tbody>
   </table>
</div>