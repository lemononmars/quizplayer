export async function getMD(fileName: string){

   let md = await import(`./${fileName}.md`)
   return md.default
}