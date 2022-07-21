export async function getMD(fileName: string){

   let md = await import(`./event${fileName}.md`)
   return md.default
}