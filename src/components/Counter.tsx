import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/blockchain/hooks/useWallet';
import { useBlockchain } from '@/blockchain/hooks/useBlockchain';
import { UserStats } from '@/blockchain/types/blockchain';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { toast } from 'sonner';

/**
 * Tap-to-Earn Game - Estilo 8-bit Minimalista
 * Jogo de cliques com contador regressivo integrado à blockchain Xion
 * Navegação por teclado: ESPAÇO para clicar, ENTER para ações
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

  // Hooks de navegação por teclado
  const startButton = useKeyboardNavigation<HTMLButtonElement>({
    onSpacePress: startGame,
    onEnterPress: startGame,
    disabled: gameStarted
  });

  const tapButton = useKeyboardNavigation<HTMLButtonElement>({
    onSpacePress: handleClick,
    disabled: !gameActive
  });

  const resetButton = useKeyboardNavigation<HTMLButtonElement>({
    onSpacePress: resetGame,
    onEnterPress: resetGame,
    disabled: isLoading || gameActive
  });

  const disconnectButton = useKeyboardNavigation<HTMLButtonElement>({
    onSpacePress: disconnect,
    onEnterPress: disconnect
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pixel-bg" style={{
      backgroundColor: 'hsl(var(--pixel-black))'
    }}>
      <div className="w-full max-w-sm">
        {/* Card principal - Estilo 8-bit Minimalista */}
        <div className="pixel-border" style={{
          backgroundColor: 'hsl(var(--pixel-black))'
        }}>
          <div className="p-6 text-center space-y-6 relative">
            {/* Botão Desconectar */}
            <button
              ref={disconnectButton.elementRef}
              onClick={disconnect}
              className={`absolute top-2 right-2 w-8 h-8 btn-danger text-xs font-bold ${disconnectButton.className}`}
              title="Desconectar"
            >
              X
            </button>

            {/* Título 8-bit */}
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

            {/* Timer 8-bit */}
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

            {/* Display do Score - Estilo 8-bit */}
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
            
            {/* Status do jogo */}
            <div className="text-sm" style={{
              color: 'hsl(var(--pixel-white))'
            }}>
              {!gameStarted ? 'PRESS START' : 
               gameActive ? 'TAP OR SPACE' : 
               finalScore !== null ? `FINAL: ${finalScore}` : 'READY'}
            </div>

            {/* Instruções de teclado */}
            <div className="text-xs" style={{
              color: 'hsl(var(--pixel-green))'
            }}>
              {!gameStarted ? 'SPACE/ENTER TO START' :
               gameActive ? 'SPACE TO TAP' :
               'SPACE/ENTER TO RESTART'}
            </div>

            {/* Botões 8-bit */}
            {!gameStarted ? (
              <button
                ref={startButton.elementRef}
                onClick={startGame}
                className={`w-full h-16 btn-success pixel-border text-lg font-bold ${startButton.className}`}
              >
                START GAME
              </button>
            ) : gameActive ? (
              <button
                ref={tapButton.elementRef}
                onClick={handleClick}
                className={`w-full h-32 btn-primary pixel-border text-2xl font-bold ${tapButton.className}`}
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
                  ref={resetButton.elementRef}
                  onClick={resetGame}
                  disabled={isLoading}
                  className={`w-full h-16 btn-warning pixel-border text-lg font-bold ${resetButton.className} disabled:opacity-50`}
                >
                  PLAY AGAIN
                </button>
              </div>
            )}

            {/* Leaderboard 8-bit */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold pixel-shadow" style={{
                color: 'hsl(var(--pixel-white))'
              }}>
                HIGH SCORES
              </h2>
              
              <div className="space-y-2">
                {leaderboard.map((player, index) => {
                  const colors = [
                    { bg: 'hsl(var(--pixel-yellow))', text: 'hsl(var(--pixel-black))' }, // 1º lugar
                    { bg: 'hsl(var(--pixel-white))', text: 'hsl(var(--pixel-black))' },   // 2º lugar
                    { bg: 'hsl(var(--pixel-red))', text: 'hsl(var(--pixel-white))' }      // 3º lugar
                  ];
                  const color = colors[index] || colors[2];
                  
                  return (
                    <div
                      key={index}
                      className="pixel-border p-2"
                      style={{
                        backgroundColor: color.bg,
                        color: color.text
                      }}
                    >
                      <div className="text-xs font-bold">
                        #{index + 1} {player.score.toString().padStart(4, '0')} - {player.address}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counter;