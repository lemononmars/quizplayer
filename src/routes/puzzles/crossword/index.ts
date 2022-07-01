import crosswords from '$lib/data/puzzles/crosswords'

/** @type {import('./__types/puzzles/crosswords/index.ts').RequestHandler} */
export async function get({ url }) {
   const tag = url.searchParams.get('tag')
   if(tag) {
      return {
         status: 200,
         body: { 
            crosswords: crosswords.filter(n => n.tags?.includes(tag))
         }
      }
   }
   else {
      return {
         body: { crosswords }
      };
   }
}