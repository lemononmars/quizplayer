export async function getMD(fileName: string){

   let md = await import(`./${fileName}`)
   return md.default
}