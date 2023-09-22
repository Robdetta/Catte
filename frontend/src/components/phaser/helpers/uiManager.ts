import { PlayerManager } from './PlayerManager';

export function updateUI(
  playerManager: PlayerManager,
  eventType: string,
  data: any,
) {
  switch (eventType) {
    case 'notification':
      // Handle UI updates for notifications
      // You can call appropriate methods of playerManager here with necessary data
      break;
    case 'gameStart':
      // Handle UI updates for game start
      // You can call appropriate methods of playerManager here with necessary data
      break;
    case 'stateChange':
      // Handle UI updates for state changes
      playerManager.displayPlayers();
      break;
    default:
      console.error(`Unhandled event type: ${eventType}`);
  }
}
