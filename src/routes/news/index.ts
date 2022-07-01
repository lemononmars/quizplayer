import {news} from '$lib/data/news'

/** @type {import('./__types/news/index.ts').RequestHandler} */
export async function get({ url }) {
   const tag = url.searchParams.get('tag')
   if(tag) {
      return {
         status: 200,
         body: { 
            news: news.filter(n => n.tags?.includes(tag))
         }
      }
   }
   else {
      return {
         body: { news }
      };
   }
}