import { localStore } from './localStore';

export const username = localStore('username', 'code breaker');
export const adventureLevel = localStore('level', '1');
export const adventureCode = localStore('code', 'start');