import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/blockchain/hooks/useWallet';
import { useBlockchain } from '@/blockchain/hooks/useBlockchain';
import { UserStats } from '@/blockchain/types/blockchain';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

/**
 * Componente contador integrado com blockchain Xion
 * Jogo de cliques com contador regressivo de 10 segundos
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Card principal */}
        <Card className="border-4 border-gray-800 rounded-3xl shadow-2xl bg-white">
          <CardContent className="p-8 text-center space-y-6">
            {/* Título */}
            <h1 className="text-3xl font-bold text-black">
              Contador XION
            </h1>

            {/* Timer */}
            {gameStarted && (
              <div className="text-2xl font-bold text-red-600">
                Tempo: {timeLeft}s
              </div>
            )}

            {/* Display do contador */}
            <div className="text-8xl font-bold text-purple-600">
              {count}
            </div>
            
            <div className="text-lg text-gray-600">
              {!gameStarted ? 'Clique em "Iniciar" para começar!' : 
               gameActive ? 'Clique o máximo que conseguir!' : 
               finalScore !== null ? `Seu score final: ${finalScore}` : 'Valor atual do Contador'}
            </div>

            {/* Botões de controle */}
            {!gameStarted ? (
              <button
                onClick={startGame}
                className="w-48 h-48 rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white text-3xl font-bold shadow-2xl hover:from-green-600 hover:to-green-800 transition-all duration-200 transform hover:scale-105 active:scale-95 mx-auto block"
              >
                Iniciar Jogo
              </button>
            ) : gameActive ? (
              <button
                onClick={handleClick}
                className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white text-4xl font-bold shadow-2xl hover:from-purple-600 hover:to-purple-800 transition-all duration-200 transform hover:scale-105 active:scale-95 mx-auto block"
              >
                Click!
              </button>
            ) : (
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-lg text-gray-600">
                    Salvando score na blockchain...
                  </div>
                ) : (
                  <div className="text-lg text-green-600 font-bold">
                    Score salvo com sucesso!
                  </div>
                )}
                <button
                  onClick={resetGame}
                  disabled={isLoading}
                  className="w-48 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xl font-bold shadow-xl hover:from-blue-600 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 mx-auto block"
                >
                  Jogar Novamente
                </button>
              </div>
            )}

            {/* Seção Rank */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-black">
                Rank
              </h2>
              
              <div className="space-y-3">
                {leaderboard.map((player, index) => (
                  <div
                    key={index}
                    className="border-2 border-purple-500 rounded-lg p-3 bg-white"
                  >
                    <div className="text-lg font-medium text-black">
                      {player.score} - {player.address}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Counter;