import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from 'colyseus.js';

const client = new Client('ws://localhost:2567');
function LandingPage() {
  const [roomKey, setRoomKey] = useState('');
  const navigate = useNavigate();

  const createRoom = async () => {
    try {
      // This will either join an existing room or create a new one if none are available.
      const room = await client.joinOrCreate('my_room');

      // Redirect the user to the game room URL with the room ID.
      navigate(`/game/${room.id}`);
    } catch (error) {
      console.error('Error creating/joining room:', error);
    }
  };

  const joinRoom = async () => {
    // Make an API request with the roomKey to join the room
    // On successful response, navigate to the game room
    if (roomKey.length !== 4) {
      alert('Please enter a valid 4-character room key.');
      return;
      navigate(`/game/join?key=${roomKey}`);
    }
  };

  return (
    <div>
      <button onClick={createRoom}>Create Game</button>

      <div>
        <input
          type='text'
          maxLength={4}
          value={roomKey}
          onChange={(e) => setRoomKey(e.target.value.toUpperCase())}
          placeholder='Enter Room Key'
        />
        <button onClick={joinRoom}>Join Game</button>
      </div>
    </div>
  );
}

export default LandingPage;
