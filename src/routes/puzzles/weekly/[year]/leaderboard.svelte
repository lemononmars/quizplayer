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
   const weekArray = Array(max-min+1).fill(0).map((x, y) => x + y + min)

   let names: string[] = []
   data.forEach(d => {
      let name = d.name
      if(!names.includes(name))
         names = [name, ...names]
   })
   names.sort((a,b) => getTotal(b) - getTotal(a))

   function getTotal(n: string) {
      let sum = 0
      data.forEach(d => {if(d.name === n) sum+= d.score})
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

<table class="table table-zebra mx-auto">
   <thead>
      <th>อันดับ</th>
      <th>ชื่อ</th>
      <th>คะแนนรวม</th>
      {#each weekArray as week}
         <th>สัปดาห์ที่ {week}</th>
      {/each}
   </thead>
   <tbody>
      {#each names as n, idx}
         <tr>
            <td>{idx+1}</td>
            <td>{n}</td>
            <td>{getTotal(n)}</td>
            {#each weekArray as week}
               <td>{findScore(n,week)}</td>
            {/each}
         </tr>
      {/each}
   </tbody>
</table>