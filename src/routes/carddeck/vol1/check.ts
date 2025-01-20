import {alphabet} from '$lib/data/puzzles/alphabet'

/** @type {import('./__types/puzzles/rebus/index.ts').RequestHandler} */
export async function get({ url }) {
   return {}

   // todo? check answer server side?
   const tag = url.searchParams.get('tag')
   if(tag) {
      return {
         status: 200,
         body: { 
            puzzles: alphabet.filter(n => n.tags?.includes(tag))
         }
      }
   }
   else {
      return {
         body: { puzzles: alphabet }
      };
   }
}