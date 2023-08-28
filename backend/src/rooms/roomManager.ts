// roomManager.ts
import { Server } from '@colyseus/core';

let gameServer: Server | null = null;

export function initializeGameServer(server: Server) {
  gameServer = server;
}

export async function createGameRoom() {
  if (!gameServer) {
    throw new Error('Game server has not been initialized.');
  }
  const room = await gameServer.createRoom('my_room');
  return {
    roomId: room.roomId,
    roomKey: room.gameKey,
  };
}
