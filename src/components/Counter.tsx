import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/blockchain/hooks/useWallet';
import { useBlockchain } from '@/blockchain/hooks/useBlockchain';
import { Player } from '@/blockchain/types/blockchain';
import { toast } from 'sonner';

/**
 * Tap-to-Earn Game - Estilo 8-bit Minimalista
 * Jogo de cliques com contador regressivo integrado à blockchain Xion
 */
const Counter: React.FC = () => {
  const { address, disconnect, formatAddress } = useWallet();
  const { saveScore, getLeaderboard, isLoading } = useBlockchain();
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameActive, setGameActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const players = await getLeaderboard();
      setLeaderboard(players);
    };
    loadData();
  }, [address, getLeaderboard]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      endGame();
    }
    return () => clearInterval(interval);
  }, [gameActive, timeLeft]);

  const endGame = useCallback(async () => {
    setGameActive(false);
    setFinalScore(count);
    
    const success = await saveScore(count);
    if (success) {
      toast.success(`Score ${count} salvo na blockchain Xion!`);
      const players = await getLeaderboard();
      setLeaderboard(players);
    }
  }, [count, saveScore, getLeaderboard]);

  const startGame = () => {
    setCount(0);
    setTimeLeft(10);
    setGameActive(true);
    setGameStarted(true);
    setFinalScore(null);
  };

  const resetGame = () => {
    setCount(0);
    setTimeLeft(10);
    setGameActive(false);
    setGameStarted(false);
    setFinalScore(null);
  };

  const handleClick = () => {
    if (gameActive) {
      setCount(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pixel-bg" style={{
      backgroundColor: 'hsl(var(--pixel-black))'
    }}>
      <div className="w-full max-w-sm">
        <div className="pixel-border" style={{
          backgroundColor: 'hsl(var(--pixel-black))'
        }}>
          <div className="p-6 text-center space-y-6 relative">
            <button
              onClick={disconnect}
              className="absolute top-2 right-2 w-8 h-8 btn-danger text-xs font-bold"
              title="Desconectar"
            >
              X
            </button>

            {/* Logo */}
            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <img 
                src="/logo512x512.png" 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold pixel-shadow" style={{
                color: 'hsl(var(--pixel-white))'
              }}>
                TAP-TO-EARN
              </h1>
              <div className="text-xs mt-1" style={{
                 color: 'hsl(var(--pixel-yellow))'
               }}>
                 ▲ XION BLOCKCHAIN
               </div>
             </div>

            {gameStarted && (
              <div className="pixel-border p-3" style={{
                backgroundColor: 'hsl(var(--pixel-yellow))',
                color: 'hsl(var(--pixel-black))'
              }}>
                <div className="text-xl font-bold">
                  TIME: {timeLeft.toString().padStart(2, '0')}
                </div>
              </div>
            )}

            <div className="pixel-border p-4" style={{
              backgroundColor: 'hsl(var(--pixel-white))',
              color: 'hsl(var(--pixel-black))'
            }}>
              <div className="text-4xl font-bold">
                {count.toString().padStart(4, '0')}
              </div>
              <div className="text-xs mt-1">
                SCORE
              </div>
            </div>
            
            <div className="text-sm" style={{
              color: 'hsl(var(--pixel-white))'
            }}>
              {!gameStarted ? 'PRESS START' : 
               gameActive ? 'TAP TO EARN' : 
               finalScore !== null ? `FINAL: ${finalScore}` : 'READY'}
            </div>

            {!gameStarted ? (
              <button
                onClick={startGame}
                className="w-full h-16 btn-success pixel-border text-lg font-bold"
              >
                START GAME
              </button>
            ) : gameActive ? (
              <button
                onClick={handleClick}
                className="w-full h-32 btn-primary pixel-border text-2xl font-bold"
              >
                TAP!
              </button>
            ) : (
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-sm animate-pulse" style={{
                    color: 'hsl(var(--pixel-yellow))'
                  }}>
                    SAVING TO BLOCKCHAIN...
                  </div>
                ) : (
                  <div className="text-sm font-bold" style={{
                    color: 'hsl(var(--pixel-green))'
                  }}>
                    SCORE SAVED!
                  </div>
                )}
                <button
                  onClick={resetGame}
                  disabled={isLoading}
                  className="w-full h-16 btn-warning pixel-border text-lg font-bold disabled:opacity-50"
                >
                  PLAY AGAIN
                </button>
              </div>
            )}

            <div className="space-y-3">
              <h2 className="text-lg font-bold pixel-shadow" style={{
                color: 'hsl(var(--pixel-white))'
              }}>
                HIGH SCORES
              </h2>
              
              <div className="space-y-2">
                {leaderboard.length > 0 ? leaderboard.map((player, index) => {
                  return (
                    <div
                      key={`${player.address}-${player.rank}-${index}`}
                      className="pixel-border p-2"
                      style={{
                        backgroundColor: '#606060',
                        color: '#ffffff'
                      }}
                    >
                      <div className="text-xs font-bold">
                        #{player.rank} {player.score.toString().padStart(4, '0')} - {formatAddress(player.address)}
                      </div>
                    </div>
                  );
                }) : (
                  <div className="pixel-border p-2" style={{
                    backgroundColor: '#606060',
                    color: '#ffffff'
                  }}>
                    <div className="text-xs font-bold text-center">
                      CARREGANDO RANKING...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counter;