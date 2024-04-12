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
   $: sortedData = data.sort((a,b)=> a.created_at.localeCompare(b.created_at))

   function toDateString(s: string) {
      const d = new Date(s)
      return d.toLocaleDateString('th-TH')
   }

   function toTimeString(s: string) {
      const d = new Date(s)
      return d.toLocaleTimeString('th-TH')
   }
</script>

<h1>ตารางอันดับ ปริศนาประจำสัปดาห์ที่ {week} ปี {year}</h1>

<table class="table table-zebra mx-auto">
   <thead>
      <th>อันดับ</th>
      <th>ชื่อ</th>
      <th>วันที่</th>
      <th>เวลา</th>
      <th>คะแนน</th>
   </thead>
   <tbody>
      {#each sortedData as d, idx}
         <tr>
            <td>{idx+1}</td>
            <td>{d.name}</td>
            <td class="text-right">{toDateString(d.created_at)}</td>
            <td class="text-right">{toTimeString(d.created_at)}</td>
            <td>{10 - Math.min(idx, 5)}</td>
         </tr>
      {/each}
   </tbody>
</table>