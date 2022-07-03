import {alphabet} from '$lib/data/puzzles/alphabet'

/** @type {import('./__types/alphabet/[id]').RequestHandler} */
export async function get({ params }) {
   const {id} = params
   // TODO: make it fetch, await, etc?
   const content = alphabet.filter(n => n.id == id)
  
   if (content.length > 0) {
     return {
       body: { content: content[0]}
     };
   }
  
   return {
     status: 404
   };
 }

