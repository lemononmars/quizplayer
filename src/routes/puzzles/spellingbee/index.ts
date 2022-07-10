import {spellingbee, numPuzzles} from '$lib/data/puzzles/spellingbee'
// import { getPuzzle } from '../../api'

/** @type {import('./__types/[id]').RequestHandler} */
export async function get({ url }) {
  const id = url.searchParams.get('id')
  if(!id || parseInt(id) > numPuzzles) {    
    const newID = Math.floor(Math.random()*numPuzzles)
    return {
      status: 303,
      headers: {
        location: `/puzzles/spellingbee?id=${newID}`
      }
    };
  }

  let content = spellingbee[id]
  return {
    body: { content }
  };
 }