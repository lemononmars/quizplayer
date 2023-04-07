/** @type {import('./__types/[id]/[answer]').RequestHandler} */
export async function get({ params }) {
   const {title, answer} = params
  
   if (title.length > 0 && answer.length > 0) {
     return {
       body: { title, answer}
     };
   }
  
   return {
     status: 404
   };
 }