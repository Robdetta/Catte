import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import { Client } from 'colyseus.js';
import './LandingPage.css';
import * as roomService from '../services/roomService';

//const client = new Client('ws://localhost:2567');
function LandingPage() {
  const [roomKey, setRoomKey] = useState<string>('');
  const navigate = useNavigate();
  const [numPlayers, setNumPlayers] = useState(1);
  const [numBots, setNumBots] = useState(0);
  const [playerName, setPlayerName] = useState('');

  const createRoom = async () => {
    try {
      const { gameKey, sessionId } = (await roomService.createRoom(
        numPlayers,
        numBots,
        playerName,
      )) as { gameKey: string; sessionId: string };
      navigate(`/game/${gameKey}?sessionId=${sessionId}`);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const joinRoom = async () => {
    if (roomKey.length !== 4) {
      alert('Please enter a valid 4-character room key.');
      return;
    }
    try {
      const result = await roomService.joinRoom(roomKey);
      if (!result) {
        throw new Error('Failed to join room.');
      }

      const { gameKey, sessionId } = result;
      navigate(`/game/${gameKey}?sessionId=${sessionId}`);
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  return (
    <div className='landing-container'>
      <label>
        Number of Players:
        <select
          value={numPlayers}
          onChange={(e) => {
            let selectedValue = parseInt(e.target.value);
            if (selectedValue + numBots < 2) {
              // enforce at least 1 bot if only 1 human
              setNumBots(1);
            }
            setNumPlayers(selectedValue);
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <option
              key={num}
              value={num}
            >
              {num}
            </option>
          ))}
        </select>
      </label>
      <label>
        Number of Bots:
        <select
          value={numBots}
          onChange={(e) => {
            let selectedValue = parseInt(e.target.value);
            if (selectedValue + numPlayers > 6) {
              // enforce maximum of 6 players
              selectedValue = 6 - numPlayers;
            }
            setNumBots(selectedValue);
          }}
        >
          {Array(7 - numPlayers)
            .fill(0)
            .map((_, index) => (
              <option
                key={index}
                value={index}
              >
                {index}
              </option>
            ))}
        </select>
      </label>
      <label>
        Player Name:
        <input
          type='text'
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder='Enter your name'
        />
      </label>
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
