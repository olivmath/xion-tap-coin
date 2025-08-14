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
  groundWidth: number;
  groundHeight: number;
  isJumping: boolean;
  showCoin: boolean;
  lastJumpTime: number;
  totalJumps: number;
  isGameOver: boolean;
  isFalling: boolean;
}

const MarioGame: React.FC = () => {
  const { address, disconnect, client } = useXion();
  const { toast } = useToast();
  
  const [gameState, setGameState] = useState<GameState>({
    coins: 0,
    groundWidth: 100,
    groundHeight: 60,
    isJumping: false,
    showCoin: false,
    lastJumpTime: 0,
    totalJumps: 0,
    isGameOver: false,
    isFalling: false,
  });

  const [players, setPlayers] = useState<Player[]>([]);
  
  // Configurações do jogo - sem cooldown de pulo
  const GROUND_DECAY_RATE = 3;      
  const GROUND_INCREASE_RATE = 8;   
  const MIN_GROUND_WIDTH = 15;       
  const MAX_GROUND_WIDTH = 100;

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

  // Ground decay effect - chão diminui continuamente
  useEffect(() => {
    if (gameState.totalJumps > 0 && !gameState.isGameOver) {
      const interval = setInterval(() => {
        setGameState(prev => {
          const newGroundWidth = Math.max(MIN_GROUND_WIDTH, prev.groundWidth - GROUND_DECAY_RATE);
          
          // Game Over quando o chão acabar
          if (newGroundWidth <= MIN_GROUND_WIDTH) {
            return {
              ...prev,
              groundWidth: newGroundWidth,
              isGameOver: true,
              isFalling: true
            };
          }
          
          return {
            ...prev,
            groundWidth: newGroundWidth
          };
        });
      }, 1000); // A cada 1 segundo

      return () => clearInterval(interval);
    }
  }, [gameState.totalJumps, gameState.isGameOver]);

  // Salvar pontuação na blockchain quando o jogo terminar
  useEffect(() => {
    if (gameState.isGameOver && gameState.coins > 0 && address) {
      saveScoreToBlockchain();
    }
  }, [gameState.isGameOver]);

  const saveScoreToBlockchain = async () => {
    try {
      // Simular salvamento na blockchain
      console.log('Salvando pontuação na blockchain:', {
        player: address,
        score: gameState.coins,
        timestamp: Date.now()
      });
      
      toast({
        title: "Game Over! 🎮",
        description: `Score ${gameState.coins} saved to blockchain!`,
      });
    } catch (error) {
      console.error('Erro ao salvar na blockchain:', error);
      toast({
        title: "Game Over! 🎮",
        description: `Final Score: ${gameState.coins}`,
        variant: "destructive",
      });
    }
  };

  const handleJump = useCallback(() => {
    // Não permitir pular se o jogo acabou
    if (gameState.isGameOver) return;

    setGameState(prev => ({
      ...prev,
      isJumping: true,
      showCoin: true,
      lastJumpTime: Date.now(),
      totalJumps: prev.totalJumps + 1,
      coins: prev.coins + 1,
      groundWidth: Math.min(MAX_GROUND_WIDTH, prev.groundWidth + GROUND_INCREASE_RATE)
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
  }, [gameState.coins, gameState.isGameOver, toast]);

  const restartGame = () => {
    setGameState({
      coins: 0,
      groundWidth: 100,
      groundHeight: 60,
      isJumping: false,
      showCoin: false,
      lastJumpTime: 0,
      totalJumps: 0,
      isGameOver: false,
      isFalling: false,
    });
  };

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
            className={`w-16 h-16 cursor-pointer transition-transform duration-500 relative z-10 ${
              gameState.isGameOver ? '' : 
              gameState.isJumping ? 'animate-mario-jump' : 'hover:scale-110'
            } ${gameState.isFalling ? 'animate-bounce' : ''}`}
            onClick={gameState.isGameOver ? undefined : handleJump}
            style={{ 
              transform: `${gameState.isJumping && !gameState.isGameOver ? 'translateY(-60px)' : ''}
                          ${gameState.isFalling ? 'translateY(100px)' : ''}`,
              bottom: `${gameState.groundHeight}px`,
              transition: gameState.isFalling ? 'transform 1s ease-in' : 'transform 0.5s'
            }}
          >
            <div className={`w-full h-full rounded-lg border-4 border-mario-brown shadow-lg ${
              gameState.isGameOver ? 'bg-gray-500' : 'bg-mario-red'
            }`}>
              <div className={`w-full h-full rounded flex items-center justify-center ${
                gameState.isGameOver ? 'bg-gradient-to-br from-gray-500 to-gray-700' : 'bg-gradient-to-br from-mario-red to-red-600'
              }`}>
                <span className="text-white font-bold text-xl">
                  {gameState.isGameOver ? '💀' : 'M'}
                </span>
              </div>
            </div>
          </div>

          {/* Ground - com animação visual de diminuição */}
          <div className="relative">
            <div 
              className="bg-mario-ground border-t-4 border-mario-brown transition-all duration-1000 relative overflow-hidden"
              style={{ 
                height: `${gameState.groundHeight}px`,
                width: '300px' // Container maior para mostrar a diminuição
              }}
            >
              {/* Chão que diminui da direita para esquerda */}
              <div 
                className="h-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${gameState.groundWidth}%`,
                  background: gameState.isGameOver ? 
                    'linear-gradient(to bottom, #dc2626, #991b1b)' : // Vermelho quando game over
                    'linear-gradient(to bottom, hsl(var(--mario-ground)), #166534)',
                  marginLeft: 'auto'
                }}
              />
              
              {/* Efeito visual de rachadura/erosão */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div 
                  className="w-full h-full transition-all duration-1000"
                  style={{
                    background: `linear-gradient(90deg, 
                      rgba(139, 69, 19, 0.3) 0%, 
                      rgba(139, 69, 19, 0.1) ${gameState.groundWidth}%, 
                      rgba(139, 69, 19, 0.6) 100%)`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Over Modal */}
      {gameState.isGameOver && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-white/95 backdrop-blur max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-pixel text-mario-red">
                Game Over! 💀
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-lg font-pixel text-mario-brown">
                Final Score: {gameState.coins} coins! 🪙
              </div>
              <div className="text-sm text-mario-brown/70">
                Score saved to XION blockchain
              </div>
              <Button 
                onClick={restartGame}
                className="w-full bg-mario-red hover:bg-mario-red/90 text-white font-pixel"
              >
                Play Again
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ground Width Indicator */}
      <div className="absolute bottom-4 left-4">
        <Card className="bg-white/90 backdrop-blur">
          <CardContent className="p-3">
            <div className="text-sm font-pixel text-mario-brown">
              Ground: {Math.round(gameState.groundWidth)}%
            </div>
            <div className="w-20 h-2 bg-gray-300 rounded mt-1">
              <div 
                className={`h-full rounded transition-all ${
                  gameState.groundWidth <= 25 ? 'bg-red-500' : 'bg-mario-ground'
                }`}
                style={{ width: `${gameState.groundWidth}%` }}
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
            <div>🏃 Ground shrinks from right to left over time</div>
            <div>🔥 No jump limit - tap rapidly!</div>
            <div>⚠️ Game over when ground reaches 15%!</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarioGame;