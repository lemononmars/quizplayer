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

export interface ISpellingBee extends IContent {
   type: 'spellingbee',
   letters: string[],
   pangram: string[],
   solutions: string[]
}

export type PuzzleType = 'alphabet' | 'rebus' | 'crossword' | 'spellingbee'