import React, { useEffect } from 'react';
import { useXion } from '@/contexts/XionContext';
import { useGameState } from '@/game/hooks/useGameState';
import { useLeaderboard } from '@/game/hooks/useLeaderboard';
import { GameArea } from '@/game/components/GameArea';
import { GameHeader } from '@/game/components/GameHeader';
import { Leaderboard } from '@/game/components/Leaderboard';
import { GameOverModal } from '@/game/components/GameOverModal';
import { GameInstructions } from '@/game/components/GameInstructions';
import { GroundIndicator } from '@/game/components/GroundIndicator';

/**
   * Componente principal do jogo Mario
   * Refatorado para usar hooks e componentes separados
   */
  const MarioGame: React.FC = () => {
    const { address, disconnect, saveScore, getLeaderboard, isLoading } = useXion();
    const { gameState, handleJump, restartGame } = useGameState();
    const { players } = useLeaderboard(gameState.coins);

  // Salvar pontuação na blockchain quando o jogo terminar
  useEffect(() => {
    if (gameState.isGameOver && gameState.coins > 0 && address) {
      saveScore(gameState.coins);
    }
  }, [gameState.isGameOver, gameState.coins, address, saveScore]);



  return (
    <div className="min-h-screen bg-gradient-to-b from-mario-sky to-mario-ground relative overflow-hidden">
      <GameHeader 
        coins={gameState.coins} 
        onDisconnect={disconnect} 
      />
      
      <GameArea 
        gameState={gameState} 
        onJump={handleJump} 
      />
      
      <GameOverModal 
        isVisible={gameState.isGameOver}
        finalScore={gameState.coins}
        onRestart={restartGame}
        isSaving={isLoading}
      />
      
      <GroundIndicator 
        groundWidth={gameState.groundWidth} 
      />
      
      <Leaderboard 
        players={players}
        currentAddress={address}
        isLoading={isLoading}
      />
      
      <GameInstructions />
    </div>
  );
};

export default MarioGame;