import { useParams, useLocation } from 'react-router-dom';

function GameComponent() {
  let { gameKey } = useParams();
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let sessionId = params.get('sessionId');

  // Rest of your component logic...
  return (
    <div>
      <p>Game Key: {gameKey}</p>
      <p>Session ID: {sessionId}</p>
      {/* Your Phaser or other game logic/rendering can go here */}
    </div>
  );
}

export default GameComponent;
