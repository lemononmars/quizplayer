import { from } from '$lib/supabase';

/**
 * a simple answer checker
 * answers are stored in the database
 *
 * @param {null}
 * @return {object} array of objects
 */
/** @type {import('/api/puzzle/weekly/[year]/[week]/[answer].ts').RequestHandler} */
export async function get() {

   const { data, error } = await from('weekly_solution').select('year, week, title');
   if(data) {
      return {
         status: 200,
         headers: { 'Content-Type': 'application/json' },
         body: {
            content: data
         }
      };
   }

   return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {
         data: null
      }
   };
}
