import {getPuzzle, numPuzzles} from '$lib/data/puzzles/spellingbee'
// import { getPuzzle } from '../../api'

/** @type {import('./__types/[id]').RequestHandler} */
export async function get({params}) {
  const {id} = params
  if(!id || parseInt(id) > numPuzzles) {    
    const newID = Math.floor(Math.random()*numPuzzles)
    return {
      status: 303,
      headers: {
        location: `/puzzles/spellingbee/${newID}`
      }
    };
  }

  let content = getPuzzle(id)
  return {
    body: { content }
  };
 }