import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/blockchain/hooks/useWallet';
import { useBlockchain } from '@/blockchain/hooks/useBlockchain';
import { UserStats } from '@/blockchain/types/blockchain';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

/**
 * Tap-to-Earn Game - Estilo Retrô 8-bit
 * Jogo de cliques com contador regressivo integrado à blockchain Xion
 */
const Counter: React.FC = () => {
  const { address, disconnect, formatAddress } = useWallet();
  const { saveScore, getUserStats, isLoading } = useBlockchain();
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameActive, setGameActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [leaderboard, setLeaderboard] = useState([
    { score: 145, address: 'xion1rvz...9ptm' },
    { score: 125, address: 'xion1rvz...9ptm' },
    { score: 105, address: 'xion1rvz...9ptm' }
  ]);

  // Carregar estatísticas do usuário ao conectar
  useEffect(() => {
    const loadUserStats = async () => {
      if (address) {
        const stats = await getUserStats();
        setUserStats(stats);
      }
    };
    loadUserStats();
  }, [address, getUserStats]);

  // Timer do jogo
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

  // Finalizar jogo e salvar score
  const endGame = useCallback(async () => {
    setGameActive(false);
    setFinalScore(count);
    
    // Salvar score na blockchain
    const success = await saveScore(count);
    if (success) {
      toast.success(`Score ${count} salvo na blockchain Xion!`);
      // Atualizar leaderboard localmente
      const newEntry = { score: count, address: address ? formatAddress(address) : 'Anônimo' };
      setLeaderboard(prev => [...prev, newEntry].sort((a, b) => b.score - a.score).slice(0, 3));
      // Recarregar estatísticas
      const stats = await getUserStats();
      setUserStats(stats);
    }
  }, [count, saveScore, getUserStats, address, formatAddress]);

  // Iniciar jogo
  const startGame = () => {
    setCount(0);
    setTimeLeft(10);
    setGameActive(true);
    setGameStarted(true);
    setFinalScore(null);
  };

  // Reiniciar jogo
  const resetGame = () => {
    setCount(0);
    setTimeLeft(10);
    setGameActive(false);
    setGameStarted(false);
    setFinalScore(null);
  };

  // Clique durante o jogo
  const handleClick = () => {
    if (gameActive) {
      setCount(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4" style={{
      backgroundImage: `
        radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, #16213e 0%, transparent 50%),
        linear-gradient(45deg, #0f0f23 25%, transparent 25%),
        linear-gradient(-45deg, #0f0f23 25%, transparent 25%)
      `,
      backgroundSize: '40px 40px, 40px 40px, 20px 20px, 20px 20px'
    }}>
      <div className="w-full max-w-sm">
        {/* Card principal - Estilo Arcade */}
        <div className="border-4 border-cyan-400 bg-gray-900 shadow-2xl" style={{
          borderRadius: '0px',
          boxShadow: '0 0 20px #00ffff, inset 0 0 20px rgba(0, 255, 255, 0.1)'
        }}>
          <div className="p-8 text-center space-y-6">
            {/* Título Retrô */}
            <div className="relative">
              <h1 className="text-4xl font-bold text-cyan-400 tracking-wider" style={{
                fontFamily: 'monospace',
                textShadow: '0 0 10px #00ffff, 2px 2px 0px #0066cc'
              }}>
                TAP-TO-EARN
              </h1>
              <div className="text-sm text-yellow-400 mt-1 tracking-widest" style={{
                fontFamily: 'monospace',
                textShadow: '0 0 5px #ffff00'
              }}>
                ⚡ XION BLOCKCHAIN ⚡
              </div>
            </div>

            {/* Timer Retrô */}
            {gameStarted && (
              <div className="bg-red-900 border-2 border-red-500 p-2" style={{
                boxShadow: '0 0 10px #ff0000'
              }}>
                <div className="text-3xl font-bold text-red-400" style={{
                  fontFamily: 'monospace',
                  textShadow: '0 0 10px #ff0000'
                }}>
                  TIME: {timeLeft.toString().padStart(2, '0')}
                </div>
              </div>
            )}

            {/* Display do Score - Estilo LED */}
            <div className="bg-black border-4 border-green-500 p-6" style={{
              boxShadow: 'inset 0 0 20px rgba(0, 255, 0, 0.3), 0 0 20px #00ff00'
            }}>
              <div className="text-7xl font-bold text-green-400" style={{
                fontFamily: 'monospace',
                textShadow: '0 0 20px #00ff00'
              }}>
                {count.toString().padStart(4, '0')}
              </div>
              <div className="text-green-300 text-sm mt-2" style={{
                fontFamily: 'monospace'
              }}>
                SCORE
              </div>
            </div>
            
            <div className="text-lg text-cyan-300" style={{
               fontFamily: 'monospace',
               textShadow: '0 0 5px #00ffff'
             }}>
               {!gameStarted ? '>>> PRESS START <<<' : 
                 gameActive ? '>>> TAP TO EARN <<<' : 
                 finalScore !== null ? `FINAL SCORE: ${finalScore}` : '>>> READY <<<'}
            </div>

            {/* Botões Arcade */}
            {!gameStarted ? (
              <button
                onClick={startGame}
                className="w-48 h-20 bg-green-600 border-4 border-green-400 text-white text-2xl font-bold transition-all duration-100 transform active:scale-95 mx-auto block"
                style={{
                  fontFamily: 'monospace',
                  textShadow: '2px 2px 0px #004400',
                  boxShadow: '0 6px 0px #004400, 0 0 20px #00ff00'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(3px)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
              >
                START GAME
              </button>
            ) : gameActive ? (
              <button
                onClick={handleClick}
                className="w-48 h-48 bg-yellow-500 border-4 border-yellow-300 text-black text-4xl font-bold transition-all duration-75 transform active:scale-95 mx-auto block"
                style={{
                  fontFamily: 'monospace',
                  textShadow: '2px 2px 0px #cc8800',
                  boxShadow: '0 8px 0px #cc8800, 0 0 30px #ffff00',
                  borderRadius: '50%'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(4px) scale(0.95)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0px) scale(1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px) scale(1)'}
              >
                TAP!
              </button>
            ) : (
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-lg text-cyan-400 animate-pulse" style={{
                     fontFamily: 'monospace',
                     textShadow: '0 0 10px #00ffff'
                   }}>
                     {'>>> SAVING TO BLOCKCHAIN <<<'}
                  </div>
                ) : (
                  <div className="text-lg text-green-400 font-bold" style={{
                    fontFamily: 'monospace',
                    textShadow: '0 0 10px #00ff00'
                  }}>
                    ✓ SCORE SAVED! ✓
                  </div>
                )}
                <button
                  onClick={resetGame}
                  disabled={isLoading}
                  className="w-48 h-16 bg-blue-600 border-4 border-blue-400 text-white text-xl font-bold transition-all duration-100 transform active:scale-95 disabled:opacity-50 mx-auto block"
                  style={{
                    fontFamily: 'monospace',
                    textShadow: '2px 2px 0px #003366',
                    boxShadow: '0 6px 0px #003366, 0 0 20px #0066ff'
                  }}
                  onMouseDown={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(3px)')}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                >
                  PLAY AGAIN
                </button>
              </div>
            )}

            {/* Leaderboard Arcade */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-yellow-400 tracking-wider" style={{
                fontFamily: 'monospace',
                textShadow: '0 0 10px #ffff00, 2px 2px 0px #cc8800'
              }}>
                🏆 HIGH SCORES 🏆
              </h2>
              
              <div className="space-y-2">
                {leaderboard.map((player, index) => (
                  <div
                    key={index}
                    className="border-2 border-purple-500 bg-purple-900 p-3" style={{
                      boxShadow: '0 0 10px #8800ff'
                    }}
                  >
                    <div className="text-lg font-medium text-purple-300" style={{
                      fontFamily: 'monospace',
                      textShadow: '0 0 5px #8800ff'
                    }}>
                      #{index + 1} {player.score.toString().padStart(4, '0')} - {player.address}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counter;