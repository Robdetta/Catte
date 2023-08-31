// services/deckService.ts
export const getDeck = () => {
  return fetch('http://localhost:2567/deck').then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  });
};
