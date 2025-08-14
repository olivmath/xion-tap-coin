import React from 'react';
import { useXion } from '@/contexts/XionContext';
import WalletLogin from '@/components/WalletLogin';
import Counter from '@/components/Counter';

const Index = () => {
  const { isConnected } = useXion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {isConnected ? <Counter /> : <WalletLogin />}
    </div>
  );
};

export default Index;
