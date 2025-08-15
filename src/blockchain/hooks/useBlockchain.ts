import { useState, useCallback, useEffect } from "react";
import { XionBlockchainService } from "../services/XionBlockchainService";
import { Player } from "../types/blockchain";
import { useWallet } from "./useWallet";
import { toast } from "sonner";

/**
 * Hook para interações com a blockchain
 * Centraliza todas as operações de smart contract
 */
export const useBlockchain = () => {
  const { client, address } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [service, setService] = useState<XionBlockchainService>(
    () => new XionBlockchainService(client)
  );

  // Atualizar o serviço quando o cliente mudar
  useEffect(() => {
    if (client) {
      setService(new XionBlockchainService(client));
    }
  }, [client]);

  const saveScore = useCallback(
    async (score: number) => {
      if (!address) {
        toast.error("Carteira não conectada");
        return false;
      }

      setIsLoading(true);
      try {
        await service.saveScore(address, score);
        return true;
      } catch (error) {
        console.error("Erro ao salvar pontuação:", error);
        toast.error("Falha ao salvar na blockchain");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [address, service, toast]
  );

  const getLeaderboard = useCallback(async (): Promise<Player[]> => {
    if (!client) {
      return [];
    }

    try {
      return await service.getLeaderboard();
    } catch (error) {
      console.error("Erro ao buscar leaderboard:", error);
      toast.error("Falha ao carregar ranking");
      return [];
    }
  }, [client, service, toast]);

  const totalGames = useCallback(async (): Promise<number> => {
    if (!client) {
      return 0;
    }

    try {
      return await service.totalGames();
    } catch (error) {
      console.error("Erro ao verificar contrato:", error);
      return 0;
    }
  }, [client, service]);

  return {
    saveScore,
    getLeaderboard,
    totalGames,
    isLoading,
  };
};
