import { from } from '$lib/supabase';
const codes = ['start', 'lemon', 'banana', 'cat']
const questions = ['2-1=?', 'how many holes does a figure 8 has?', 'answer three', 'four']
/**
 * a simple answer checker
 * answers are stored in the database
 *
 * @param {null}
 * @return {object} array of objects
 */
/** @type {import('/api/puzzle/adventure/[level]/get/[code]').RequestHandler} */
export async function get({ params }) {

   const {level, code} = params;

   if(code === codes[level-1])
      return {
         status: 200,
         headers: { 'Content-Type': 'application/json' },
         body: {
            result: 'correct',
            question: questions[level-1],
            image: ''
         }
      };
   else 
      return {
         status: 200,
         headers: { 'Content-Type': 'application/json' },
         body: {
            result: 'incorrect',
            hint: 'enter level'
         }
      };
}
