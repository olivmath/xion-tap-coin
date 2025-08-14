import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Trophy, Coins } from 'lucide-react';
import { Player } from '../../blockchain/types/blockchain';

interface LeaderboardProps {
  players: Player[];
  currentAddress?: string;
  isLoading?: boolean;
}

/**
 * Componente do ranking de jogadores
 * Mostra os melhores scores
 */
export const Leaderboard: React.FC<LeaderboardProps> = ({ 
  players, 
  currentAddress, 
  isLoading = false 
}) => {
  const formatAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 8)}...${address.slice(-4)}`;
  };

  return (
    <div className="absolute bottom-4 right-4 w-80">
      <Card className="bg-white/95 backdrop-blur">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-pixel text-mario-brown">
            <Trophy className="w-5 h-5 text-mario-gold" />
            Ranking
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-48">
            <div className="p-4 space-y-2">
              {isLoading ? (
                <div className="text-center text-mario-brown/60 py-4">
                  Carregando...
                </div>
              ) : players.length === 0 ? (
                <div className="text-center text-mario-brown/60 py-4">
                  Nenhum jogador encontrado
                </div>
              ) : (
                players.slice(0, 10).map((player, index) => (
                  <div key={player.address}>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-mario-gold text-mario-brown' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          'bg-gray-200 text-mario-brown'
                        }`}>
                          {player.rank}
                        </div>
                        <div>
                          <div className={`text-sm font-medium ${
                            player.address === currentAddress ? 'text-mario-red font-bold' : 'text-mario-brown'
                          }`}>
                            {formatAddress(player.address)}
                            {player.address === currentAddress && ' (Você)'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-mario-gold" />
                        <span className="text-sm font-bold text-mario-brown">
                          {player.score}
                        </span>
                      </div>
                    </div>
                    {index < players.length - 1 && <Separator />}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};