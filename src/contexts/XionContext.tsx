import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Abstraxion, useAbstraxionAccount, useAbstraxionSigningClient } from '@burnt-labs/abstraxion';

interface XionContextType {
  address: string | undefined;
  isConnected: boolean;
  client: any;
  connect: () => void;
  disconnect: () => void;
}

const XionContext = createContext<XionContextType | undefined>(undefined);

const XION_CONFIG = {
  contracts: [
    {
      address: "xion1aza0jdzfc7g0u64k8qcvcxfppll0cjeer56k38vpshe3p26q5kzswpywp9",
      amounts: [{ denom: "uxion", amount: "1000000" }],
    },
  ],
  stake: false,
};

const XionInnerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(!!account?.bech32Address);
  }, [account]);

  const connect = () => {
    // Abstraxion handles connection automatically
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

export const XionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Abstraxion contracts={XION_CONFIG.contracts} stake={XION_CONFIG.stake}>
      <XionInnerProvider>
        {children}
      </XionInnerProvider>
    </Abstraxion>
  );
};

export const useXion = () => {
  const context = useContext(XionContext);
  if (context === undefined) {
    throw new Error('useXion must be used within a XionProvider');
  }
  return context;
};