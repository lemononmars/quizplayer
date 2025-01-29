import {getDailySpellingBee} from '$lib/data/puzzles/spellingbee'
// import { getPuzzle } from '../../api'

/** @type {import('./__types/[id]').RequestHandler} */
export async function get({}) {
  return {
    body: { content: getDailySpellingBee() }
  };
}