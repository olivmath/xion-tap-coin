import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useXion } from '@/contexts/XionContext';
import { LogOut, Trophy, Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Player {
  address: string;
  score: number;
  rank: number;
}

interface GameState {
  coins: number;
  groundHeight: number;
  isJumping: boolean;
  showCoin: boolean;
  lastJumpTime: number;
  totalJumps: number;
}

const MarioGame: React.FC = () => {
  const { address, disconnect } = useXion();
  const { toast } = useToast();
  
  const [gameState, setGameState] = useState<GameState>({
    coins: 0,
    groundHeight: 100,
    isJumping: false,
    showCoin: false,
    lastJumpTime: 0,
    totalJumps: 0,
  });

  const [players, setPlayers] = useState<Player[]>([]);
  
  // Jump rate limit: 1 jump per second
  const JUMP_COOLDOWN = 1000;
  const GROUND_DECAY_RATE = 2;
  const GROUND_INCREASE_RATE = 5;
  const MIN_GROUND_HEIGHT = 20;
  const MAX_GROUND_HEIGHT = 100;

  // Mock ranking data - in real app this would come from blockchain
  useEffect(() => {
    const mockPlayers: Player[] = [
      { address: 'xion1abc...def', score: 1250, rank: 1 },
      { address: 'xion1ghi...jkl', score: 980, rank: 2 },
      { address: 'xion1mno...pqr', score: 750, rank: 3 },
      { address: 'xion1stu...vwx', score: 620, rank: 4 },
      { address: 'xion1yza...bcd', score: 450, rank: 5 },
      { address: address || '', score: gameState.coins, rank: 6 },
    ].sort((a, b) => b.score - a.score).map((player, index) => ({
      ...player,
      rank: index + 1
    }));
    
    setPlayers(mockPlayers);
  }, [gameState.coins, address]);

  // Ground decay effect
  useEffect(() => {
    if (gameState.totalJumps > 0) {
      const interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          groundHeight: Math.max(MIN_GROUND_HEIGHT, prev.groundHeight - GROUND_DECAY_RATE)
        }));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [gameState.totalJumps]);

  const handleJump = useCallback(() => {
    const now = Date.now();
    if (now - gameState.lastJumpTime < JUMP_COOLDOWN) {
      toast({
        title: "Too fast!",
        description: "Wait a moment before jumping again.",
        variant: "destructive",
      });
      return;
    }

    setGameState(prev => ({
      ...prev,
      isJumping: true,
      showCoin: true,
      lastJumpTime: now,
      totalJumps: prev.totalJumps + 1,
      coins: prev.coins + 1,
      groundHeight: Math.min(MAX_GROUND_HEIGHT, prev.groundHeight + GROUND_INCREASE_RATE)
    }));

    // Reset jump animation
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        isJumping: false
      }));
    }, 500);

    // Hide coin animation
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        showCoin: false
      }));
    }, 800);

    toast({
      title: "Coin earned! 🪙",
      description: `Total coins: ${gameState.coins + 1}`,
    });
  }, [gameState.lastJumpTime, gameState.coins, toast]);

  const formatAddress = (addr: string) => {
    if (addr.length <= 12) return addr;
    return `${addr.slice(0, 8)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-mario-sky to-mario-ground relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <Card className="bg-white/90 backdrop-blur">
          <CardContent className="p-3 flex items-center gap-2">
            <Coins className="w-5 h-5 text-mario-gold" />
            <span className="font-pixel text-mario-brown font-bold">
              {gameState.coins}
            </span>
          </CardContent>
        </Card>
        
        <Button
          onClick={disconnect}
          variant="secondary"
          size="sm"
          className="bg-white/90 backdrop-blur"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </div>

      {/* Game Area */}
      <div className="flex items-end justify-center h-screen pb-8">
        <div className="relative">
          {/* Block */}
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-mario-block border-4 border-mario-brown shadow-lg">
            <div className="w-full h-full bg-gradient-to-br from-mario-gold to-mario-block flex items-center justify-center">
              <span className="text-mario-brown font-bold text-lg">?</span>
            </div>
          </div>

          {/* Floating Coin */}
          {gameState.showCoin && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-fade-in">
              <div className="w-8 h-8 bg-mario-gold rounded-full border-2 border-mario-brown shadow-lg animate-bounce">
                <div className="w-full h-full bg-gradient-to-br from-mario-gold to-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-mario-brown font-bold text-sm">¢</span>
                </div>
              </div>
            </div>
          )}

          {/* Mario */}
          <div 
            className={`w-16 h-16 cursor-pointer transition-transform duration-500 ${
              gameState.isJumping ? 'animate-mario-jump' : 'hover:scale-110'
            }`}
            onClick={handleJump}
            style={{ 
              transform: `translateY(-${gameState.groundHeight}px) ${
                gameState.isJumping ? 'translateY(-60px)' : ''
              }` 
            }}
          >
            <div className="w-full h-full bg-mario-red rounded-lg border-4 border-mario-brown shadow-lg">
              <div className="w-full h-full bg-gradient-to-br from-mario-red to-red-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
            </div>
          </div>

          {/* Ground */}
          <div 
            className="w-32 bg-mario-ground border-t-4 border-mario-brown transition-all duration-1000"
            style={{ height: `${gameState.groundHeight}px` }}
          >
            <div className="w-full h-full bg-gradient-to-b from-mario-ground to-green-700"></div>
          </div>
        </div>
      </div>

      {/* Ground Height Indicator */}
      <div className="absolute bottom-4 left-4">
        <Card className="bg-white/90 backdrop-blur">
          <CardContent className="p-3">
            <div className="text-sm font-pixel text-mario-brown">
              Ground: {gameState.groundHeight}%
            </div>
            <div className="w-20 h-2 bg-gray-300 rounded mt-1">
              <div 
                className="h-full bg-mario-ground rounded transition-all"
                style={{ width: `${gameState.groundHeight}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ranking Panel */}
      <div className="absolute bottom-4 right-4 w-80">
        <Card className="bg-white/95 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-pixel text-mario-brown">
              <Trophy className="w-5 h-5 text-mario-gold" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-48">
              <div className="p-4 space-y-2">
                {players.slice(0, 10).map((player, index) => (
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
                            player.address === address ? 'text-mario-red font-bold' : 'text-mario-brown'
                          }`}>
                            {formatAddress(player.address)}
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
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <div className="absolute top-20 left-4">
        <Card className="bg-white/90 backdrop-blur max-w-xs">
          <CardContent className="p-3 text-sm text-mario-brown space-y-1">
            <div>🎯 Click Mario to jump and hit the block</div>
            <div>🪙 Earn coins with each successful jump</div>
            <div>🏃 Ground decreases over time</div>
            <div>⏱️ 1 second cooldown between jumps</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarioGame;