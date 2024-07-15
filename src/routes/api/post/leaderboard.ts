import { from } from '$lib/supabase';
import type { Leaderboard } from '$lib/interfaces'
import { sendhook} from '$lib/discord'
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post( {request} ){
	let submission: Leaderboard = await request.json()
	const {name, puzzle_type, puzzle_id, score} = submission

   // weekly puzzle requires scoring system
   if(puzzle_type === 'weekly') {
      const {data, error} = await from('leaderboard').select('*').eq('puzzle_id', puzzle_id)
      if(data) {
         submission.score = 10 - Math.min(data.length,5)
      }
   }
	const {data, error} = await from('leaderboard').insert(submission)

   if(error) {
 	   sendhook(
         'error submitting ' + puzzle_type + '/' + puzzle_id
      )
      return error
   }

   sendhook(
      ':game_die: ' + puzzle_type + '/' + puzzle_id + ' solved by ' + name + ' - ' + score
   )
	return data
}