import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAbstraxionAccount, useAbstraxionSigningClient } from '@burnt-labs/abstraxion';

interface XionContextType {
  address: string | undefined;
  isConnected: boolean;
  client: any;
  connect: () => void;
  disconnect: () => void;
}

const XionContext = createContext<XionContextType | undefined>(undefined);

export const XionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

  const value: XionContextType = {
    address: account?.bech32Address,
    isConnected,
    client,
    connect,
    disconnect,
  };

  return (
    <XionContext.Provider value={value}>
      {children}
    </XionContext.Provider>
  );
};

export const useXion = () => {
  const context = useContext(XionContext);
  if (context === undefined) {
    throw new Error('useXion must be used within a XionProvider');
  }
  return context;
};