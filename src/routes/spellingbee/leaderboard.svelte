<script context=module lang=ts>
   export async function load({fetch}) {

      const res = await fetch('/api/leaderboard/spellingbee')
      const data = await res.json()

      return {
         props: { data }
      };
   }
</script>

<script lang=ts>
   import type {Leaderboard} from '$lib/interfaces'
   import {todayDateThaiString} from '$lib/utils/date'
   import {getDailySpellingBee} from '$lib/data/puzzles/spellingbee'

   export let data: Leaderboard[]
   const date = new Date()
   const todayDate = date.toISOString()
   const id = getDailySpellingBee().id
   $: sortedData = data.filter(d=>d.puzzle_id === id)
      .sort((a,b)=> a.score - b.score)

   function timeToString(n: number) {
      const min = Math.floor(n/1000)
      const sec = Math.floor((n%1000)/10)
      return min + '.' + sec + ' วินาที'
   }
</script>

<a href="/puzzles/spellingbee">
   <h1>ตารางอันดับ สะกดศัพท์ ประจำวันที่ {todayDateThaiString()}</h1>
</a>

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
            <td class="text-right">{timeToString(d.score)}</td>
         </tr>
      {/each}
   </tbody>
</table>