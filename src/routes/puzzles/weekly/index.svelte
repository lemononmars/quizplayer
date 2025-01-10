<script context=module lang=ts>
   export async function load({fetch}) {
      const res = await fetch(`/api/puzzle/weekly/`)
      const content = await res.json()

      return {
         props: {
            content: content.content
         }
      }
   }
</script>

<script lang=ts>
   export let content
   let years: number[] = []
   content.forEach(c => {
      if(!years.includes(c.year))
         years.push(c.year)
   });
   years.reverse()
</script>

<div class="flex flex-col gap-2 h-full lg:h-auto relative overflow-y-clip lg:overflow-y-none text-left">
   {#each years as y}
      <h1> ปี {y} </h1>
      <ul>
      {#each content.filter(c => c.year == y).sort((a,b) => b.week - a.week) as c}
         <li>
            <a href="/puzzles/weekly/{c.year}/{c.week}">สัปดาห์ที่ {c.week} - {c.title? c.title: ""}</a>
         </li>
      {/each}
      </ul>
   {/each}
</div>