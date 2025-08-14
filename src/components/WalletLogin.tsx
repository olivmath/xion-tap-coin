import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useXion } from '@/contexts/XionContext';
import { Wallet } from 'lucide-react';

const WalletLogin: React.FC = () => {
  const { connect, isConnected, address } = useXion();

  if (isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-mario-sky to-mario-ground p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-mario-red rounded-full flex items-center justify-center">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-pixel text-mario-brown">
            Super Mario Tap-to-Earn
          </CardTitle>
          <CardDescription className="text-mario-brown/70">
            Connect your XION wallet to start earning coins!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            onClick={connect}
            className="w-full h-12 bg-mario-red hover:bg-mario-red/90 text-white font-pixel text-lg shadow-lg"
          >
            Connect Wallet
          </Button>
          <div className="text-center text-sm text-mario-brown/60">
            Powered by XION Network
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletLogin;