import {puzzleHunts} from '$lib/data/puzzles/puzzlehunt'

/** @type {import('./__types/events/index.ts').RequestHandler} */
export async function get({}) {
   return {
      status: 200,
      body: { 
         puzzleHunts
      }
   }
}