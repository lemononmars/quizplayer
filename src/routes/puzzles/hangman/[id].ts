import {hangman} from '$lib/data/puzzles/hangman'

/** @type {import('./__types/hangman/[id]').RequestHandler} */
export async function get({ params }) {
   const {id} = params
   // TODO: make it fetch, await, etc?
   const content = hangman.filter(n => n.id == id)
  
   if (content.length > 0) {
     return {
       body: { content: content[0]}
     };
   }
  
   return {
     status: 404
   };
 }

