import { useState, useCallback } from 'react';
import { XionBlockchainService } from '../services/XionBlockchainService';
import { Player, UserStats } from '../types/blockchain';
import { useWallet } from './useWallet';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para interações com a blockchain
 * Centraliza todas as operações de smart contract
 */
export const useBlockchain = () => {
  const { client, address } = useWallet();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [service] = useState(() => new XionBlockchainService(client));

  const saveScore = useCallback(async (score: number) => {
    if (!address) {
      toast({
        title: "Erro",
        description: "Carteira não conectada",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      await service.saveScore(address, score);
      toast({
        title: "Sucesso! 🎮",
        description: `Pontuação ${score} salva na blockchain!`,
      });
      return true;
    } catch (error) {
      console.error('Erro ao salvar pontuação:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar na blockchain",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address, service, toast]);

  const getLeaderboard = useCallback(async (): Promise<Player[]> => {
    try {
      return await service.getLeaderboard();
    } catch (error) {
      console.error('Erro ao buscar leaderboard:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar ranking",
        variant: "destructive",
      });
      return [];
    }
  }, [service, toast]);

  const getUserStats = useCallback(async (): Promise<UserStats | null> => {
    if (!address) return null;

    try {
      return await service.getUserStats(address);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return null;
    }
  }, [address, service]);

  const isContractAvailable = useCallback(async (): Promise<boolean> => {
    try {
      return await service.isContractAvailable();
    } catch (error) {
      console.error('Erro ao verificar contrato:', error);
      return false;
    }
  }, [service]);

  return {
    saveScore,
    getLeaderboard,
    getUserStats,
    isContractAvailable,
    isLoading,
  };
};