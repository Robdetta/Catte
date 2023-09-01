function addPlayer(): boolean {
  if (numPlayers >= 6) return false; // Return false if max players reached.
  numPlayers++;
  createPlayer(numPlayers - 1); // Create the player at the new index.
  return true; // Return true if player was successfully added.
}

function removePlayer(): boolean {
  if (numPlayers <= 2) return false; // Return false if min players reached.
  numPlayers--;
  destroyPlayer(numPlayers); // Remove the last player.
  return true; // Return true if player was successfully removed.
}

function createPlayer(index: number): void {
  const angle = (index / numPlayers) * 2 * Math.PI;
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);
  players.push(new Player(this, x, y));
}

function destroyPlayer(index: number): void {
  const player = players[index];
  // Destroy the avatar and any cards this player has.
  player.avatar.destroy();
  player.hand.forEach((card) => card.destroy());
  players.splice(index, 1);
}

export { addPlayer, removePlayer, createPlayer, destroyPlayer };
