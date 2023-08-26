import React, { useState } from 'react';

const LandingPage: React.FC = () => {
  const [gameKey, setGameKey] = useState('');

  return (
    <div className='landing'>
      <h1>Welcome to the Card Game</h1>

      <div>
        <button onClick={createGame}>Create New Game</button>
      </div>

      <div>
        <input
          type='text'
          placeholder='Enter game key'
          value={gameKey}
          onChange={(e) => setGameKey(e.target.value)}
        />
        <button onClick={() => joinGame(gameKey)}>Join Game</button>
      </div>
    </div>
  );

  function createGame() {
    // Logic to generate a random 4 character key and create a new game
  }

  function joinGame(key: string) {
    // Logic to join an existing game with the provided key
  }
};

export default LandingPage;
