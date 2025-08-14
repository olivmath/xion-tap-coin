import { useState, useEffect, useCallback } from 'react';
import { Player } from '../../blockchain/types/blockchain';
import { useBlockchain } from '../../blockchain/hooks/useBlockchain';
import { useWallet } from '../../blockchain/hooks/useWallet';

/**
 * Hook para gerenciar o leaderboard
 * Combina dados da blockchain com o score atual
 */
export const useLeaderboard = (currentScore: number) => {
  const { getLeaderboard } = useBlockchain();
  const { address } = useWallet();
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadLeaderboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const leaderboardData = await getLeaderboard();
      
      // Adicionar o jogador atual se não estiver na lista
      let updatedPlayers = [...leaderboardData];
      
      if (address) {
        const currentPlayerIndex = updatedPlayers.findIndex(p => p.address === address);
        
        if (currentPlayerIndex >= 0) {
          // Atualizar score do jogador atual
          updatedPlayers[currentPlayerIndex] = {
            ...updatedPlayers[currentPlayerIndex],
            score: Math.max(updatedPlayers[currentPlayerIndex].score, currentScore)
          };
        } else {
          // Adicionar jogador atual
          updatedPlayers.push({
            address,
            score: currentScore,
            rank: 0 // Será recalculado
          });
        }
      }
      
      // Reordenar e recalcular ranks
      const sortedPlayers = updatedPlayers
        .sort((a, b) => b.score - a.score)
        .map((player, index) => ({
          ...player,
          rank: index + 1
        }));
      
      setPlayers(sortedPlayers);
    } catch (error) {
      console.error('Erro ao carregar leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getLeaderboard, address, currentScore]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const getCurrentPlayerRank = useCallback(() => {
    if (!address) return null;
    const currentPlayer = players.find(p => p.address === address);
    return currentPlayer?.rank || null;
  }, [address, players]);

  const getTopPlayers = useCallback((limit: number = 10) => {
    return players.slice(0, limit);
  }, [players]);

  return {
    players,
    isLoading,
    loadLeaderboard,
    getCurrentPlayerRank,
    getTopPlayers,
  };
};