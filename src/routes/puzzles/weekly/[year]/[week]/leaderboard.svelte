<script context=module lang=ts>
   import type {Leaderboard} from '$lib/interfaces'
   export async function load({fetch, params}) {

      const {year, week} = params
      const res = await fetch('/api/leaderboard/weekly')
      const data: Leaderboard[] = await res.json()
      console.log(year+week)

      return {
         props: { 
            data: data.filter(d=>d.puzzle_id == year+week),
            year,
            week
         },
         
      };
   }
</script>

<script lang=ts>
   export let data: Leaderboard[], year: number, week: number
   $: sortedData = data.sort((a,b)=> a.created_at > b.created_at?0:1)

</script>

<h1>ตารางอันดับ ปริศนาประจำสัปดาห์ที่ {week} ปี {year}</h1>

<table class="table table-zebra mx-auto">
   <thead>
      <th>อันดับ</th>
      <th>ชื่อ</th>
      <th>เวลา</th>
   </thead>
   <tbody>
      {#each sortedData as d, idx}
         <tr>
            <td>{idx+1}</td>
            <td>{d.name}</td>
            <td class="text-right">{d.created_at}</td>
         </tr>
      {/each}
   </tbody>
</table>