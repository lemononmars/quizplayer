export interface IContent {
   type: 'news' | 'rebus' | 'crossword',
   id: number,
   title: string,
   image?: string,
   date: string,
   tags?: string[],
}

export interface INews extends IContent {
   type: 'news',
   content: string,
}

export interface IRebus extends IContent {
   type: 'rebus',
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