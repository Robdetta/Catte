import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

function StartingScreen() {
  const [roomKey, setRoomKey] = useState('');
  const navigate = Navigate();

  const createRoom = async () => {
    // Make an API request to the backend to create a new room
    // On successful response, navigate to the game room
    try {
      // Make an API request to the backend to create a new room
      const response = await fetch('/create-room', { method: 'POST' });
      const data = await response.json();

      // On successful response, navigate to the game room
      navigate(`/game/${data.roomId}?key=${data.roomKey}`);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create a game room. Please try again.');
    }
  };

  const joinRoom = async () => {
    // Make an API request with the roomKey to join the room
    // On successful response, navigate to the game room
    if (roomKey.length !== 4) {
      alert('Please enter a valid 4-character room key.');
      return;
      history.push(`/game/join?key=${roomKey}`);
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

export default StartingScreen;
