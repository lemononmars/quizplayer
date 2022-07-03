import {rebuses} from '$lib/data/puzzles/rebus'
import { getPuzzle } from '../../api'

/** @type {import('./__types/[id]').RequestHandler} */
export async function get({ params }) {
  const {id} = params
  const res = await getPuzzle('rebus', id)

  let content = await res.body 
  if(!res.ok && content.length > 0)
    content = await res.body
  else
    content = rebuses.filter(n => n.id == id)
  
   if (content.length > 0) {
     return {
       body: { content: content[0]}
     };
   }
  
   return {
     status: 404
   };
 }