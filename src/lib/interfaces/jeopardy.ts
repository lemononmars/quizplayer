export interface PlayerInfo {
   username: string,
   color: number,
   score: number,
   wager: number,
   answer: string,
   image?: URL
}

export interface GameState {
   round: number,
   isLocked: boolean,
   isDouble: boolean,
   isWagering: boolean,
   isAnswering: boolean
}

export interface RoomInfo {
   roomID: string,
   playerList: PlayerInfo[]
   isActive: boolean
}

interface Round {
   categories: string[],
   questions: string[][],
   answers: string[][],
   dailyDouble: number[],
}

export interface GameInfo {
   title: string,
   round1: Round,
   round2: Round,
   final: string[],
}