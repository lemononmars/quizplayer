import correctSound from './rightanswer.mp3'
import pingSound from './ping.mp3'
import incorrectSound from './wronganswer.mp3'
import doubleSound from './dailydouble.mp3'
import timesupSound from './timesup.mp3'

export type soundType = 'correct'|'incorrect'|'double'|'timesup'|'ping'

export const loadSounds = () => {
   return {
      correct: new Audio(correctSound),
      incorrect: new Audio(incorrectSound),
      double: new Audio(doubleSound),
      timesup: new Audio(timesupSound),
      ping: new Audio(pingSound)
   }
}