import {rebuses as rebus} from '$lib/data/puzzles/rebus'
import crossword from '$lib/data/puzzles/crosswords'
import {alphabet} from '$lib/data/puzzles/alphabet'

/** @type {import('./__types/puzzles/index.ts').RequestHandler} */
export async function get({ url }) {
   const tag = url.searchParams.get('tag')
   if(tag) {
      return {
         status: 200,
         body: { 
            puzzles: {
               rebus: rebus.filter(n => n.tags?.includes(tag)),
               crossword: crossword.filter(n => n.tags?.includes(tag)),
               alphabet: alphabet.filter(n => n.tags?.includes(tag))
            }
         }
      }
   }
   else {
      return {
         body: { 
            puzzles: {
               rebus, crossword, alphabet
            } 
         }
      };
   }
}