import {hangman} from '$lib/data/puzzles/hangman'

/** @type {import('./__types/puzzles/rebus/index.ts').RequestHandler} */
export async function get({ url }) {
   const tag = url.searchParams.get('tag')
   if(tag) {
      return {
         status: 200,
         body: { 
            puzzles: hangman.filter(n => n.tags?.includes(tag))
         }
      }
   }
   else {
      return {
         body: { puzzles: hangman }
      };
   }
}