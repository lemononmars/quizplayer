export interface IContent {
   type: 'news' | 'rebus' | 'crossword' | 'alphabet',
   id: number,
   title: string,
   date: string,
   tags?: string[],
   author?: string
}

export interface INews extends IContent {
   type: 'news',
   image: string,
   content: string,
}

export interface IRebus extends IContent {
   type: 'rebus',
   image: string,
   question: string,
   hints?: string[],
   answer: string
}

export interface IPuzzleCrossword extends IContent {
   type: 'crossword',
   clues: CrosswordClue[],
   size: [number, number]
}

export interface CrosswordClue {
   clue: string,
   answer: string,
   direction: 'down' | 'across',
   position: [number, number]
}

export interface IAlphabet extends IContent {
   type: 'alphabet',
   hints: string[],
   answers: string[]
}

export type PuzzleType = 'alphabet' | 'rebus' | 'crossword'