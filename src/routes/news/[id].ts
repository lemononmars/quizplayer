import {news} from '$lib/data/news'

/** @type {import('./__types/[id]').RequestHandler} */
export async function get({ params }) {
   const {id} = params
   const content = news.filter(n => n.id == id)
  
   if (content.length > 0) {
     return {
       body: { content: content[0]}
     };
   }
  
   return {
     status: 404
   };
 }