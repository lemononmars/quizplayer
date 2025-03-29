export interface PlayerInfo {
   username: string,
   color: number,
   score: number,
   wager: number,
   answer: string,
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