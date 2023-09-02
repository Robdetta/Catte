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

    room.onMessage('notification', handleNotification);

    // Cleanup listeners on component unmount
    return () => {
      room.onMessage('notification', handleNotification);
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
          console.log('Button clicked');
          room.send('type', { type: 'drawCard' });
        }}
        style={{
          position: 'absolute',
          top: '10px', // Adjust as needed
          left: '10px', // Adjust as needed
          zIndex: 1000, // Ensure it's above the Phaser game
        }}
      >
        Draw Card
      </button>
    </div>
  );
}

export default GameComponent;
