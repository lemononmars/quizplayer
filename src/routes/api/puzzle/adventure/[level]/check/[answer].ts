import { from } from '$lib/supabase';
const codes = ['start', 'lemon', 'banana', 'cat', 'end']
const solutions = ['1', '2', '3', '4']
/**
 * a simple answer checker
 * answers are stored in the database
 *
 * @param {null}
 * @return {object} array of objects
 */
/** @type {import('/api/puzzle/adventure/[level]/check/[answer].ts').RequestHandler} */
export async function get({ params }) {

   const {level, answer} = params;
   console.log(level, answer)

   if(answer === solutions[level-1])
      return {
         status: 200,
         headers: { 'Content-Type': 'application/json' },
         body: {
            result: 'correct',
            code: codes[level]
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
	
	const { data, error } = await from('adventure').select('*').eq('level', level);
}
