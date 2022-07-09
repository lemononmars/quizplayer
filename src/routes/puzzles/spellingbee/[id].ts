import {spellingbee} from '$lib/data/puzzles/spellingbee'
import { getPuzzle } from '../../api'

/** @type {import('./__types/[id]').RequestHandler} */
export async function get({ params }) {
  const {id} = params
  const res = await getPuzzle('spellingbee', id)

  let content = await res.body 
  if(content.length > 0)
    content = await res.body
  else
    content = spellingbee.filter(n => n.id == id)
   if (content.length > 0) {
     return {
       body: { content: content[0]}
     };
   }
  
   return {
     status: 404
   };
 }