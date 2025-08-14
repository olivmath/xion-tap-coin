import React from 'react';
import { useXion } from '@/contexts/XionContext';
import WalletLogin from '@/components/WalletLogin';
import Counter from '@/components/Counter';

const Index = () => {
  const { isConnected } = useXion();

  return (
    <div className="min-h-screen bg-black" style={{
      backgroundImage: `
        radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, #16213e 0%, transparent 50%),
        linear-gradient(45deg, #0f0f23 25%, transparent 25%),
        linear-gradient(-45deg, #0f0f23 25%, transparent 25%)
      `,
      backgroundSize: '40px 40px, 40px 40px, 20px 20px, 20px 20px'
    }}>
      {isConnected ? <Counter /> : <WalletLogin />}
    </div>
  );
};

export default Index;
