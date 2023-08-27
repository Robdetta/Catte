import config from '@colyseus/tools';
import { monitor } from '@colyseus/monitor';
import { playground } from '@colyseus/playground';
import { generateGameKey } from './rooms/gameKeyGenerator';

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
    app.get('/hello_world', (req, res) => {
      res.send("It's time to kick ass and chew bubblegum!");
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
    app.post('/room', async (req, res) => {
      try {
        const room = await gameServer.requestToJoinOrCreate('my_room', {});
        const roomKey = generateGameKey();

        room.metadata = { roomKey };

        res.json({ roomId: room.roomId, roomKey });
      } catch (error) {
        res.status(500).send('Error creating room');
      }
    });
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  },
});
