import type { PuzzleType } from '$lib/interfaces'
import {from} from '$lib/supabase'

export async function getPuzzle(type: PuzzleType, id: number)  {
   console.log('grabbing puzzle')
   const { data, error } = await from(type).select('*').eq('id', id);

   if(error) {
      return {
         status: 500,
         headers: { 'Content-Type': 'application/json' },
         body: []
      }
   }
	return {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		body: data
	};
}

