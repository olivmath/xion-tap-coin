import React from 'react';
import { useXion } from '@/contexts/XionContext';
import WalletLogin from '@/components/WalletLogin';
import MarioGame from '@/components/MarioGame';

const Index = () => {
  const { isConnected } = useXion();

  if (!isConnected) {
    return <WalletLogin />;
  }

  return <MarioGame />;
};

export default Index;
