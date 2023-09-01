function updatePlayerPositions(): void {
  players.forEach((player, index) => {
    const angle = (index / numPlayers) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    player.avatar.setPosition(x, y);
    // Adjust cards positions too, if needed
    player.hand.forEach((card, cardIndex) => {
      card.setPosition(x + cardIndex * 30, y + 100); // Adjust as per your card layout
    });
  });
}

export { updatePlayerPositions };
