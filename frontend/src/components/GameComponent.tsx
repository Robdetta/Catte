import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PhaserGame from './phaser/PhaserGame';
import { getRoom } from './phaser/helpers/roomStore';
import Notification from './notification/notification';

function GameComponent() {
  let { gameKey } = useParams();
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let sessionId = params.get('sessionId');
  console.log('ParentComponent rendered');

  const [notification, setNotification] = useState<string | null>(null);

  const room = getRoom();
  console.log(room);

  useEffect(() => {
    if (!room) return;

    const handleNotification = (message: { text: string }) => {
      setNotification(message.text);
      setTimeout(() => setNotification(null), 5000);
    };

    const handleGameStart = (message: { message: string }) => {
      console.log(message);
    };

    const handleTurnChange = (message: { newTurnPlayerId: string }) => {
      console.log('New player turn:', message.newTurnPlayerId);
    };

    room.onMessage('notification', handleNotification);
    room.onMessage('gameStart', handleGameStart);
    room.onMessage('turnChange', handleTurnChange);

    // Cleanup listeners on component unmount
    return () => {
      // room.onMessage('notification', handleNotification);
      // room.onMessage('gameStart', handleGameStart);
      // room.onMessage('turnChange', handleTurnChange);
    };
  }, [room]);

  // Rest of your component logic...
  return (
    <div>
      {/* <p>Game Key: {gameKey}</p>
      <p>Session ID: {sessionId}</p> */}
      <Notification room={room} />
      {/* Your Phaser or other game logic/rendering can go here */}
      <PhaserGame />
      <button
        onClick={() => {
          if (room) {
            room.send('playerReady', {});
          } else {
            console.error('Room is not defined!');
          }
        }}
        style={{
          position: 'absolute',
          top: '50px',
          left: '10px',
          zIndex: 1000,
        }}
      >
        Ready
      </button>
    </div>
  );
}

export default GameComponent;
