import { useState, useEffect } from 'react';
import { useAbstraxionAccount, useAbstraxionSigningClient } from '@burnt-labs/abstraxion';

/**
 * Hook para gerenciar conexão da carteira
 * Separado da lógica do jogo
 */
export const useWallet = () => {
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(!!account?.bech32Address);
  }, [account]);

  const connect = () => {
    // Abstraxion handles connection automatically via modal
  };

  const disconnect = () => {
    // Handle logout if needed
    setIsConnected(false);
  };

  const formatAddress = (address: string) => {
    if (address.length <= 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };
  return {
    address: account?.bech32Address,
    isConnected,
    client,
    connect,
    disconnect,
    formatAddress,
  };
};