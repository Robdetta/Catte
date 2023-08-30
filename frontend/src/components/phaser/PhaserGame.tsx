// PhaserGame.tsx
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import phaserConfig from './phaserConfig';

const PhaserGame: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let game: Phaser.Game | null = null;

    if (gameContainerRef.current) {
      phaserConfig.parent = gameContainerRef.current;
      game = new Phaser.Game(phaserConfig);
    }
    const resizeGame = () => {
      if (game) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        game.resize(width, height);
      }
    };

    const resize = () => {
      if (game) {
        game.scale.resize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', resizeGame);

    return () => {
      if (game) game.destroy(true);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      ref={gameContainerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
      }}
    />
  );
};

export default PhaserGame;
