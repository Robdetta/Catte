const suits: string[] = ['hearts', 'diamonds', 'clubs', 'spades'];

const values: string[] = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'Jack',
  'Queen',
  'King',
  'Ace',
];

function generateShuffleDeck(): string[] {
  let deck: string[] = [];

  for (let suit of suits) {
    for (let value of values) {
      deck.push(`${suit}${value}`);
    }
  }
  deck = deck.sort(() => Math.random() - 0.5);
  return deck;
}

export { suits, values, generateShuffleDeck };
