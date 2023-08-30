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

        if (game.canvas) {
          game.canvas.width = width;
          game.canvas.height = height;
        }

        if (game.scene.scenes.length > 0) {
          const mainScene = game.scene.scenes[0];
          const width = window.innerWidth;
          const height = window.innerHeight;

          mainScene.cameras.main.setSize(width, height);
          mainScene.cameras.main.centerOn(width / 2, height / 2);
        }
      }
    };

    window.addEventListener('resize', resizeGame);

    return () => {
      window.removeEventListener('resize', resizeGame);
      if (game) game.destroy(true);
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
