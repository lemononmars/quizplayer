export interface IContent {
   type: 'news' | 'rebus' | 'crossword' | 'hangman',
   id: number,
   title: string,
   date: string,
   tags?: string[],
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

export interface IHangman extends IContent {
   type: 'hangman',
   hints: string[],
   answers: string[]
}