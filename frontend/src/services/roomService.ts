import { Client } from 'colyseus.js';
import { setRoom } from '../components/phaser/helpers/roomStore';

const client = new Client('ws://localhost:2567');

export interface RoomCreationResult {
  gameKey: string;
  sessionId: string;
}

export const createRoom = async (
  numPlayers: number,
  numBots: number,
  playerName: string,
): Promise<RoomCreationResult | undefined> => {
  // ... the logic to create a room
  // This function can return important data or throw an error if something goes wrong
  try {
    const room = await client.joinOrCreate('my_room', {
      numPlayers,
      numBots,
      playerName,
    });

    // Store the room instance
    setRoom(room);

    // Fetch the gameKey from the server
    const response = await fetch(
      `http://localhost:2567/getGameKey?roomId=${room.id}`,
    );
    const data = await response.json();

    if (data.gameKey) {
      // Redirect using gameKey
      return { gameKey: data.gameKey, sessionId: room.sessionId };
    } else {
      console.error('Error fetching gameKey:', data.error);
      throw new Error('Error fetching gameKey'); // Throw an error to be caught in the `catch` block.
    }
  } catch (error) {
    console.error('Error creating/joining room:', error);
  }
};

export const joinRoom = async (
  roomKey: string,
): Promise<RoomCreationResult | undefined> => {
  // ... the logic to join a room
  // This function can return important data or throw an error if something goes wrong
  try {
    const room = await client.join('my_room', { gameKey: roomKey });

    // Store the room instance
    setRoom(room);

    if (room) {
      return { gameKey: roomKey, sessionId: room.sessionId };
    } else {
      console.error(
        'Error joining room: Could not join the room with the given gameKey.',
      );
      throw new Error('Could not join the room with the given gameKey');
    }
  } catch (error) {
    console.error('Error joining room:', error);
    throw error; // rethrow the error to be caught by caller
  }
};