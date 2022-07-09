import {spellingbee} from '$lib/data/puzzles/spellingbee'

/** @type {import('./__types/puzzles/rebus/index.ts').RequestHandler} */
export async function get({ url }) {
   const tag = url.searchParams.get('tag')
   if(tag) {
      return {
         status: 200,
         body: { 
            puzzles: spellingbee.filter(n => n.tags?.includes(tag))
         }
      }
   }
   else {
      return {
         body: { puzzles: spellingbee }
      };
   }
}