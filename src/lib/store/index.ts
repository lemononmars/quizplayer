import { localStore } from './localStore';

export const username = localStore('username', '');
export const storeMyInfo = localStore('myInfo', '');
export const storeGameState = localStore('gameState', '');
export const storePlayerList = localStore('playerList', '{}');