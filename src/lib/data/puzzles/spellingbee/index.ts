import daily from '$lib/data/puzzles/spellingbee/daily.json'
import spellingBeeWords from '$lib/data/puzzles/spellingbee/7letters.json'

export const numPuzzles = spellingBeeWords.length

export function getRandomPuzzle() {
   const randomID = Math.floor(Math.random()*numPuzzles)
   return spellingBeeWords[randomID]
}

export function getPuzzle(id: number){
   return spellingBeeWords[id]
}

export function getDailySpellingBee() {
   // July 13, 2022 GMT+7 Game Epoch
  const epochMs = 1657645200000
  const now = Date.now()
  const msInDay = 86400000
  const dateIndex = Math.floor((now - epochMs) / msInDay) % daily.length
  return daily[dateIndex]
}