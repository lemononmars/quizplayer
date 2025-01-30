<script context=module lang=ts>
   import type {Leaderboard} from '$lib/interfaces'
   export async function load({fetch, params}) {

      const {year, week} = params
      const res = await fetch('/api/leaderboard/weekly')
      const data: Leaderboard[] = await res.json()
      return {
         props: { 
            data: data.filter(d=>d.puzzle_id % 100 == week && Math.floor(d.puzzle_id / 100) == year),
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

<a href="/puzzles/weekly/{year}/leaderboard">ดูตารางอันดับของปี {year}</a>

<table class="table table-zebra mx-auto sticky">
   <thead>
      <th>อันดับ</th>
      <th>ชื่อ</th>
      <th>วันที่</th>
      <th>เวลา</th>
      <th>คะแนน</th>
   </thead>
   <tbody>
      {#each sortedData as d, idx}
         <tr class="{idx <=5 ? 'bg-slate-50':''}">
            <td class="text-accent text-center">{idx+1}</td>
            {#if d.name.length > 15}
                  <th><div class="tooltip" data-tip="{d.name}">{d.name.slice(0,20) + '...'}</div></th>
               {:else}
                  <th>{d.name}</th>
               {/if}
            <td class="text-right">{toDateString(d.created_at)}</td>
            <td class="text-right">{toTimeString(d.created_at)}</td>
            <td>{d.score}</td>
         </tr>
      {/each}
   </tbody>
</table>