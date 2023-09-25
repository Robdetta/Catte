import { Room } from 'colyseus.js';

let roomInstance: Room | null = null;
let currentPlayerSessionId: string | null = null;

export const setRoom = (room: Room) => {
  roomInstance = room;
  currentPlayerSessionId = room.sessionId;
};

export const getRoom = () => roomInstance;

export const getCurrentPlayerSessionId = () => currentPlayerSessionId;
