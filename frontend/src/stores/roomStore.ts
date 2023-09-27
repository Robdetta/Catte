import { Room } from 'colyseus.js';
import { Player } from '../models/Player';

let roomInstance: Room | null = null;
let currentPlayerSessionId: string | null = null;
let playerArray: Player[] = [];

export const setRoom = (room: Room) => {
  roomInstance = room;
  currentPlayerSessionId = room.sessionId;
};

export const setPlayerArray = (players: Player[]) => {
  playerArray = players;
};

export const getRoom = () => roomInstance;

export const getPlayerArray = () => playerArray;
export const getCurrentPlayerSessionId = () => currentPlayerSessionId;
