import { Room } from 'colyseus.js';

let roomInstance: Room | null = null;

export const setRoom = (room: Room): void => {
  roomInstance = room;
};

export const getRoom = (): Room | null => {
  return roomInstance;
};
