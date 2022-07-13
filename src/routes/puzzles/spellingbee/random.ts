import {spellingbee, numPuzzles} from '$lib/data/puzzles/spellingbee'
// import { getPuzzle } from '../../api'

/** @type {import('./__types/[id]').RequestHandler} */
export async function get() {
  console.log('grabbing a random puzzle')
  const newID = Math.floor(Math.random()*numPuzzles)
  return {
    status: 303,
    headers: {
      location: `/puzzles/spellingbee/${newID}`
    }
  }
}