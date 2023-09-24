// private displayCards(hand: string[], playerId: string) {
//     const room = getRoom();
//     if (!room || !room.state || !room.state.players) {
//       console.error('No room, room state, or players available');
//       return;
//     }

//     // Clear previous hand if exists
//     this.clearPreviousHands();

//     // Get the current player and display their cards
//     const currentPlayer = room.state.players.get(playerId);
//     if (!currentPlayer) {
//       console.error('Current player not found in room state');
//       return;
//     }

//     // Define the offset values to position the cards in a row below the player's avatar
//     const xOffset = 30; // horizontal space between cards
//     const yOffset = -100; // vertical space from the player avatar to the cards

//     // Calculate the total width occupied by the cards and find the starting X position to center the cards with respect to the avatar
//     const totalWidthOfCards = (hand.length - 1) * xOffset;
//     const baseX = (currentPlayer.x ?? 0) - totalWidthOfCards / 2;
//     const baseY = currentPlayer.y ?? 0 - yOffset;

//     // Loop over the cards in the hand and create an image for each one
//     hand.forEach((card, index) => {
//       // Create a new image for the card and set its position
//       const cardImage = this.add.image(
//         baseX + index * xOffset,
//         baseY + yOffset,
//         'cards',
//         card,
//       );

//       // Add the image to the player's hand array so it can be accessed and modified later
//       if (!this.playerCardImages[playerId]) {
//         this.playerCardImages[playerId] = [];
//       }
//       this.playerCardImages[playerId].push(cardImage);
//     });
//   }

//   private displayCardBacksForPlayer(
//     _playerId: string,
//     playerData: Player,
//     x: number,
//     y: number,
//   ) {
//     if (playerData.hand) {
//       const numberOfCards = playerData.hand.length;
//       const xOffset = 30;
//       const yOffset = -100;
//       const baseX = x - ((numberOfCards - 1) * xOffset) / 2;
//       const baseY = y + yOffset;

//       for (let i = 0; i < numberOfCards; i++) {
//         this.add.image(
//           baseX + i * xOffset,
//           baseY,
//           'cards',
//           'card_back_frame_name',
//         );
//       }
//     }
//   }

//   private clearPlayerCards(playerId: string) {
//     if (this.playerCardImages[playerId]) {
//       this.playerCardImages[playerId].forEach((cardImage) =>
//         cardImage.destroy(),
//       );
//       delete this.playerCardImages[playerId];
//     }
//   }

// private clearPreviousHands() {
//     // Loop through all player hands and destroy any existing card images
//     Object.values(this.playerCardImages).forEach((cardImages) => {
//       cardImages.forEach((cardImage) => cardImage.destroy());
//     });

//     // Reset the playerCardImages object
//     this.playerCardImages = {};
//   }

//   private shuffleDeck(deck: string[]): string[] {
//     for (let i = deck.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [deck[i], deck[j]] = [deck[j], deck[i]];
//     }
//     return deck;
//   }

//   private dealCards(
//     deck: string[],
//     numPlayers: number,
//     cardsPerPlayer: number,
//   ): string[][] {
//     const hands: string[][] = Array.from({ length: numPlayers }, () => []);
//     for (let i = 0; i < cardsPerPlayer; i++) {
//       for (let j = 0; j < numPlayers; j++) {
//         const dealtCard = deck.pop();
//         if (dealtCard) hands[j].push(dealtCard);
//       }
//     }
//     return hands;
//   }
