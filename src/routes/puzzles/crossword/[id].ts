import crosswords from '$lib/data/puzzles/crosswords'

/** @type {import('./__types/[id]').RequestHandler} */
export async function get({ params }) {
   const {id} = params
   // TODO: make it fetch, await, etc?
   const content = crosswords.filter(n => n.id == id)
  
   if (content.length > 0) {
     return {
       body: { content: crosswords[0]}
     };
   }
  
   return {
     status: 404
   };
 }