import React, { createContext, useContext, ReactNode } from 'react';
import { useWallet } from '@/blockchain/hooks/useWallet';
import { useBlockchain } from '@/blockchain/hooks/useBlockchain';
import { Player, UserStats } from '@/blockchain/types/blockchain';

interface XionContextType {
  // Wallet
  address: string | undefined;
  isConnected: boolean;
  client: any;
  connect: () => void;
  disconnect: () => void;
  formatAddress: (address: string) => string;
  
  // Blockchain
  saveScore: (score: number) => Promise<boolean>;
  getLeaderboard: () => Promise<Player[]>;
  isLoading: boolean;
}

const XionContext = createContext<XionContextType | undefined>(undefined);

export const XionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const wallet = useWallet();
  const blockchain = useBlockchain();

  const value: XionContextType = {
    ...wallet,
    ...blockchain,
  };

  return (
    <XionContext.Provider value={value}>
      {children}
    </XionContext.Provider>
  );
};

export const useXion = (): XionContextType => {
  const context = useContext(XionContext);
  if (context === undefined) {
    throw new Error('useXion must be used within a XionProvider');
  }
  return context;
};