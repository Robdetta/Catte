import { useParams, useLocation } from 'react-router-dom';
import PhaserGame from './phaser/PhaserGame';

function GameComponent() {
  let { gameKey } = useParams();
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let sessionId = params.get('sessionId');
  console.log('ParentComponent rendered');
  // Rest of your component logic...
  return (
    <div>
      {/* <p>Game Key: {gameKey}</p>
      <p>Session ID: {sessionId}</p> */}
      {/* Your Phaser or other game logic/rendering can go here */}
      <PhaserGame />
    </div>
  );
}

export default GameComponent;
