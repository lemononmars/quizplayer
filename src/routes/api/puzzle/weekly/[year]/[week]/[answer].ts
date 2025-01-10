import { from } from '$lib/supabase';

/**
 * a simple answer checker
 * answers are stored in the database
 *
 * @param {null}
 * @return {object} array of objects
 */
/** @type {import('/api/puzzle/weekly/[year]/[week]/[answer].ts').RequestHandler} */
export async function get({ params }) {

   const {year, week, answer} = params;

   const { data, error } = await from('weekly_solution').select('*').eq('week', week).eq('year', year);
   if(data) {
      const ans = await data[0].answer

      if(answer.toUpperCase() === ans.toUpperCase())
         return {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: {
               result: true
            }
         };
   }

   return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {
         result: false
      }
   };
}
