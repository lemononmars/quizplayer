import { localStore } from './localStore';

export const username = localStore('username', 'code breaker');
export const adventureProgress = localStore('adventure', 'start');