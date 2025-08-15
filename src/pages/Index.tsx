import React from 'react';
import { useXion } from '@/contexts/XionContext';
import WalletLogin from '@/components/WalletLogin';
import Counter from '@/components/Counter';

const Index = () => {
  const { isConnected } = useXion();

  return (
    <div className="min-h-screen pixel-bg" style={{
      backgroundColor: 'hsl(var(--pixel-black))'
    }}>
      {isConnected ? <Counter /> : <WalletLogin />}
    </div>
  );
};

export default Index;
