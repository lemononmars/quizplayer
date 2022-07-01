import {rebuses} from '$lib/data/puzzles/rebus'

/** @type {import('./__types/[id]').RequestHandler} */
export async function get({ params }) {
   const {id} = params
   // TODO: make it fetch, await, etc?
   const content = rebuses.filter(n => n.id == id)
  
   if (content.length > 0) {
     return {
       body: { content: content[0]}
     };
   }
  
   return {
     status: 404
   };
 }