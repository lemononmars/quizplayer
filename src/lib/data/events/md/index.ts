const NUM_EVENTS = 5

export async function getMD(id: number){
   if(id > 5)
      return {}
      
   let md = await import(`./event0${id}.md`)
   return md.default
}