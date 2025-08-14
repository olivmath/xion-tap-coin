import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LogOut, Coins } from 'lucide-react';

interface GameHeaderProps {
  coins: number;
  onDisconnect: () => void;
}

/**
 * Componente do cabeçalho do jogo
 * Mostra pontuação e botão de desconectar
 */
export const GameHeader: React.FC<GameHeaderProps> = ({ coins, onDisconnect }) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
      <Card className="bg-white/90 backdrop-blur">
        <CardContent className="p-3 flex items-center gap-2">
          <Coins className="w-5 h-5 text-mario-gold" />
          <span className="font-pixel text-mario-brown font-bold">
            {coins}
          </span>
        </CardContent>
      </Card>
      
      <Button
        onClick={onDisconnect}
        variant="secondary"
        size="sm"
        className="bg-white/90 backdrop-blur"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Desconectar
      </Button>
    </div>
  );
};