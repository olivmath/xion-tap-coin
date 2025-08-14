import { useState, useEffect, useCallback } from 'react';
import { GameState } from '../types/game';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para gerenciar o estado do jogo
 * Separado da lógica de blockchain
 */
export const useGameState = () => {
  const { toast } = useToast();
  
  const [gameState, setGameState] = useState<GameState>({
    coins: 0,
    groundWidth: 100,
    groundHeight: 60,
    isJumping: false,
    showCoin: false,
    lastJumpTime: 0,
    totalJumps: 0,
    isGameOver: false,
    isFalling: false,
  });

  // Configurações do jogo
  const GROUND_DECAY_RATE = 5;
  const GROUND_INCREASE_RATE = 10;
  const MIN_GROUND_WIDTH = 15;
  const MAX_GROUND_WIDTH = 100;

  // Ground decay effect - chão diminui continuamente
  useEffect(() => {
    if (gameState.totalJumps > 0 && !gameState.isGameOver) {
      const interval = setInterval(() => {
        setGameState((prev: GameState) => {
          const newGroundWidth = Math.max(MIN_GROUND_WIDTH, prev.groundWidth - GROUND_DECAY_RATE);
          
          // Game Over quando o chão acabar
          if (newGroundWidth <= MIN_GROUND_WIDTH) {
            return {
              ...prev,
              groundWidth: newGroundWidth,
              isGameOver: true,
              isFalling: true
            };
          }
          
          return {
            ...prev,
            groundWidth: newGroundWidth
          };
        });
      }, 600); // A cada 0.6 segundos

      return () => clearInterval(interval);
    }
  }, [gameState.totalJumps, gameState.isGameOver]);

  const handleJump = useCallback(() => {
    // Não permitir pular se o jogo acabou
    if (gameState.isGameOver) return;

    setGameState((prev: GameState) => ({
      ...prev,
      isJumping: true,
      showCoin: true,
      lastJumpTime: Date.now(),
      totalJumps: prev.totalJumps + 1,
      coins: prev.coins + 1,
      groundWidth: Math.min(MAX_GROUND_WIDTH, prev.groundWidth + GROUND_INCREASE_RATE)
    }));

    // Reset jump animation
    setTimeout(() => {
      setGameState((prev: GameState) => ({
        ...prev,
        isJumping: false
      }));
    }, 200);

    // Hide coin animation
    setTimeout(() => {
      setGameState((prev: GameState) => ({
        ...prev,
        showCoin: false
      }));
    }, 800);

    toast({
      title: "Moeda coletada! 🪙",
      description: `Total de moedas: ${gameState.coins + 1}`,
    });
  }, [gameState.coins, gameState.isGameOver, toast]);

  const restartGame = useCallback(() => {
    setGameState({
      coins: 0,
      groundWidth: 100,
      groundHeight: 60,
      isJumping: false,
      showCoin: false,
      lastJumpTime: 0,
      totalJumps: 0,
      isGameOver: false,
      isFalling: false,
    });
  }, []);

  return {
    gameState,
    handleJump,
    restartGame,
    gameConfig: {
      GROUND_DECAY_RATE,
      GROUND_INCREASE_RATE,
      MIN_GROUND_WIDTH,
      MAX_GROUND_WIDTH,
    }
  };
};