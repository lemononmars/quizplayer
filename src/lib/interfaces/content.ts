export interface IContent {
   type: 'event' | 'blog' | PuzzleType,
   id: number,
   title: string,
   date: string,
   tags?: string[],
   author?: string
}

export interface IEvent extends IContent {
   type: 'event',
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

export interface ISpellingBee {
   type: 'spellingbee',
   id: number,
   word: string
}

export interface IPuzzleHuntSingle {
   index: number,
   title: string,
   file: string,
   hints: string[],
   solution?: string
}

export interface IPuzzleHunt extends IContent{
   type: 'puzzlehunt',
   id: number,
   image?: string,
   title: string,
   puzzles: IPuzzleHuntSingle[]
}

export type PuzzleType = 'alphabet' | 'rebus' | 'crossword' | 'puzzlehunt'