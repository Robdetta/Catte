import config from '@colyseus/tools';
import { monitor } from '@colyseus/monitor';
import { playground } from '@colyseus/playground';
import { gameKeyToRoomId } from './rooms/roomData';
import { generateShuffleDeck } from './rooms/schema/cardOperations';

/**
 * Import your Room files
 */
import { CardGameRoom } from './rooms/CardGameRoom';

export default config({
  initializeGameServer: (gameServer) => {
    /**
     * Define your room handlers:
     */
    gameServer.define('my_room', CardGameRoom);
  },

  initializeExpress: (app) => {
    /**
     * Bind your custom express routes here:
     * Read more: https://expressjs.com/en/starter/basic-routing.html
     */
    // Assuming you have the following imports:
    // import express from 'express';
    // const app = express();

    app.get('/getGameKey', (req, res) => {
      const roomId = req.query.roomId;
      const gameKey = Object.keys(gameKeyToRoomId).find(
        (key) => gameKeyToRoomId[key] === roomId,
      );
      if (gameKey) {
        res.json({ gameKey });
      } else {
        res.status(404).json({ error: 'Room not found' });
      }
    });
    app.get('/game/:gameKey', (req, res) => {
      const gameKey = req.params.gameKey;
      const sessionId = req.query.sessionId;
      const roomId = gameKeyToRoomId[gameKey];

      // Logic to verify the sessionId belongs to this gameKey (room)
      // Fetch game state or perform other logic...

      res.json({ roomId, gameKey, sessionId });
    });

    app.get('/joinRoom', (req, res) => {
      const gameKey = req.query.gameKey;

      if (typeof gameKey !== 'string') {
        return res.status(400).json({ error: 'Invalid gameKey' });
      }

      const roomId = gameKeyToRoomId[gameKey];

      if (!roomId) {
        return res
          .status(404)
          .json({ error: 'No room found with the given gameKey' });
      }

      // If we get here, it means the gameKey is valid and associated with a room.
      return res.json({ roomId });
    });

    // Generate and return a shuffled deck
    app.get('/deck', (req, res) => {
      const deck = generateShuffleDeck();
      res.json(deck);
    });

    /**
     * Use @colyseus/playground
     * (It is not recommended to expose this route in a production environment)
     */
    if (process.env.NODE_ENV !== 'production') {
      app.use('/', playground);
    }

    /**
     * Use @colyseus/monitor
     * It is recommended to protect this route with a password
     * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
     */
    app.use('/colyseus', monitor());
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  },
});
