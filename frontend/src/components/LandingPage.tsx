import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from 'colyseus.js';
import './LandingPage.css';

const client = new Client('ws://localhost:2567');
function LandingPage() {
  const [roomKey, setRoomKey] = useState('');
  const navigate = useNavigate();

  const createRoom = async () => {
    try {
      const room = await client.joinOrCreate('my_room');

      // Fetch the gameKey from the server
      const response = await fetch(
        `http://localhost:2567/getGameKey?roomId=${room.id}`,
      );
      const data = await response.json();

      if (data.gameKey) {
        // Redirect using gameKey
        navigate(`/game/${data.gameKey}?sessionId=${room.sessionId}`);
      } else {
        console.error('Error fetching gameKey:', data.error);
      }
    } catch (error) {
      console.error('Error creating/joining room:', error);
    }
  };

  const joinRoom = async () => {
    if (roomKey.length !== 4) {
      alert('Please enter a valid 4-character room key.');
      return;
    }
    try {
      const room = await client.join('my_room', { gameKey: roomKey });

      // Check if you successfully joined the room
      if (room) {
        navigate(`/game/${roomKey}?sessionId=${room.sessionId}`);
      } else {
        console.error(
          'Error joining room: Could not join the room with the given gameKey.',
        );
      }
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  return (
    <div className='landing-container'>
      <button
        className='create-button'
        onClick={createRoom}
      >
        Create Game
      </button>

      <div className='room-key-container'>
        <input
          type='text'
          maxLength={4}
          value={roomKey}
          onChange={(e) => setRoomKey(e.target.value.toUpperCase())}
          placeholder='Enter Room Key'
          className='room-key-input'
        />
        <button
          className='join-button'
          onClick={joinRoom}
        >
          Join Game
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
