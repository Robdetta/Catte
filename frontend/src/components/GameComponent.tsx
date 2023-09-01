import { useParams, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import PhaserGame from './phaser/PhaserGame';

function GameComponent() {
  let { gameKey } = useParams();
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let sessionId = params.get('sessionId');
  console.log('ParentComponent rendered');

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const handleNotification = (message) => {
      setNotification(message.text);
      setTimeout(() => setNotification(null), 5000);
    };

    room.onMessage('notification', handleNotification);

    // Cleanup listeners on component unmount
    return () => {
      room.offMessage('notification', handleNotification);
    };
  }, [room]);

  // Rest of your component logic...
  return (
    <div>
      {/* <p>Game Key: {gameKey}</p>
      <p>Session ID: {sessionId}</p> */}
      {/* Your Phaser or other game logic/rendering can go here */}
      <PhaserGame />
      {notification && (
        <div className='notification-overlay'>{notification}</div>
      )}
    </div>
  );
}

export default GameComponent;
