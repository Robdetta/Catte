import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PhaserGame from './phaser/PhaserGame';
import { getRoom } from '../stores/roomStore';
import Notification from './notification/notification';

function GameComponent() {
  let { gameKey } = useParams();
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let sessionId = params.get('sessionId');
  console.log('ParentComponent rendered');

  const [notification, setNotification] = useState<string | null>(null);
  const [playerHand, setPlayerHand] = useState<string[]>([]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log('Copying to clipboard was successful!');
      },
      (err) => {
        console.error('Could not copy text: ', err);
      },
    );
  };

  const room = getRoom();
  console.log(room);

  useEffect(() => {
    if (!room) return;

    const handleNotification = (message: { text: string }) => {
      setNotification(message.text);
      setTimeout(() => setNotification(null), 5000);
    };

    const handleGameStart = (message: { message: string; hands: any }) => {
      console.log('Game started with hands:', message.hands);
      if (sessionId) {
        const hand = message.hands[sessionId];
        if (hand) {
          setPlayerHand(hand);
        }
      }
    };
    const handleTurnChange = (message: { newTurnPlayerId: string }) => {
      console.log('Entire new turn message:', message);
      console.log('New player turn:', message.newTurnPlayerId);
    };

    room.onMessage('notification', handleNotification);
    room.onMessage('gameStart', handleGameStart);
    room.onMessage('turnChange', handleTurnChange); // Use handleTurnChange here

    // Cleanup listeners on component unmount
    return () => {
      // room.onMessage('notification', handleNotification);
      // room.onMessage('gameStart', handleGameStart);
      // room.onMessage('turnChange', handleTurnChange);
    };
  }, [room, sessionId]);

  // Rest of your component logic...
  return (
    <div>
      {/* <p>Game Key: {gameKey}</p>
      <p>Session ID: {sessionId}</p> */}
      <Notification room={room} />
      {/* Your Phaser or other game logic/rendering can go here */}
      <PhaserGame
        playerHand={playerHand}
        numPlayers={0}
        numBots={0}
        room={undefined}
      />
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

      {gameKey ? (
        <button
          onClick={() => gameKey && copyToClipboard(gameKey)}
          style={{
            position: 'absolute',
            top: '100px', // Adjust as necessary
            left: '10px',
            zIndex: 1000,
            backgroundColor: '#f0f0f0', // Styling the button a bit
            border: '1px solid #ccc',
            padding: '10px',
          }}
        >
          {gameKey}
        </button>
      ) : (
        <p
          style={{
            position: 'absolute',
            top: '100px', // Adjust as necessary
            left: '10px',
            zIndex: 1000,
          }}
        >
          Loading game key...
        </p>
      )}
    </div>
  );
}

export default GameComponent;
