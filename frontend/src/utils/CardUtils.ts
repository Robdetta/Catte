import { Player } from '../models/Player';

export default class CardUtils {
  displayCards(
    hand: string[],
    playerId: string,
    addImageCallback: Function,
    currentPlayer: Player,
  ) {
    // Define the offset values to position the cards in a row below the player's avatar
    const xOffset = 30; // horizontal space between cards
    const yOffset = -100; // vertical space from the player avatar to the cards

    // Calculate the total width occupied by the cards and find the starting X position to center the cards with respect to the avatar
    const totalWidthOfCards = (hand.length - 1) * xOffset;
    const baseX = (currentPlayer.x ?? 0) - totalWidthOfCards / 2;
    const baseY = currentPlayer.y ?? 0 - yOffset;

    // Loop over the cards in the hand and create an image for each one

    hand.forEach((card, index) => {
      addImageCallback(baseX + index * xOffset, baseY + yOffset, 'cards', card);
    });
  }

  displayCardBacksForPlayer(
    playerId: string,
    playerData: Player,
    x: number,
    y: number,
    addImageCallback: Function,
  ) {
    if (playerData.hand) {
      const numberOfCards = playerData.hand.length;
      const xOffset = 30;
      const yOffset = -100;
      const baseX = x - ((numberOfCards - 1) * xOffset) / 2;
      const baseY = y + yOffset;

      for (let i = 0; i < numberOfCards; i++) {
        addImageCallback(
          baseX + i * xOffset,
          baseY,
          'cards',
          'card_back_frame_name',
        );
      }
    }
  }

  shuffleDeck(deck: string[]): string[] {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  dealCards(
    deck: string[],
    numPlayers: number,
    cardsPerPlayer: number,
  ): string[][] {
    const hands: string[][] = Array.from({ length: numPlayers }, () => []);
    for (let i = 0; i < cardsPerPlayer; i++) {
      for (let j = 0; j < numPlayers; j++) {
        const dealtCard = deck.pop();
        if (dealtCard) hands[j].push(dealtCard);
      }
    }
    return hands;
  }
}
