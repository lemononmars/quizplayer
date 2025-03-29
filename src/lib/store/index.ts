import { localStore } from './localStore';

export const username = localStore('username', 'code breaker');
export const storeMyInfo = localStore('myInfo', '');
export const storeGameState = localStore('gameState', '');
export const storeRoomInfo = localStore('roomInfo', '');