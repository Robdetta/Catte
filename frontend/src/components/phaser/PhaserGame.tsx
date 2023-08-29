// PhaserGame.tsx
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import phaserConfig from './phaserConfig';

const PhaserGame: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let game: Phaser.Game | null = null;
    console.log('Phaser Initialization started');
    if (gameContainerRef.current) {
      phaserConfig.parent = gameContainerRef.current;
      game = new Phaser.Game(phaserConfig);
    }

    return () => {
      if (game) game.destroy(true);
    };
  }, []);

  return (
    <div
      ref={gameContainerRef}
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

export default PhaserGame;
