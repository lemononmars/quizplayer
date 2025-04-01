import { type GameInfo } from "$lib/interfaces"

export const demo: GameInfo = {
   title: 'Test',
   round1: {
      categories: ['A', 'B', 'C', 'D', 'E', 'F'],
      questions: [
         ['A1', 'A2', 'A3', 'A4', 'A5'],
         ['B1', 'B2', 'B3', 'B4', 'B5'],
         ['C1', 'C2', 'C3', 'C4', 'C5'],
         ['D1', 'D2', 'D3', 'D4', 'D5'],
         ['E1', 'E2', 'E3', 'E4', 'E5'],
         ['F1', 'F2', 'F3', 'F4', 'F5'],
      ],
      answers: [
         ['A1a', 'A2a', 'A3a', 'A4a', 'A5a'],
         ['B1a', 'B2a', 'B3a', 'B4a', 'B5a'],
         ['C1a', 'C2a', 'C3a', 'C4a', 'C5a'],
         ['D1a', 'D2a', 'D3a', 'D4a', 'D5a'],
         ['E1a', 'E2a', 'E3a', 'E4a', 'E5a'],
         ['F1a', 'F2a', 'F3a', 'F4a', 'F5a']
      ],
      dailyDouble: [1,2],
   },
   round2: {
      categories: ['A', 'B', 'C', 'D', 'E', 'F'],
      questions: [
         ['A1', 'A2', 'A3', 'A4', 'A5']
      ],
      answers: [],
      dailyDouble: [1,2],
   },
   final: ['2', 'What is 1+1?']
}