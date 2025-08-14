import React, { useState, useEffect } from 'react';
import { useWallet } from '@/blockchain/hooks/useWallet';
import { useBlockchain } from '@/blockchain/hooks/useBlockchain';
import { UserStats } from '@/blockchain/types/blockchain';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

/**
 * Componente contador integrado com blockchain Xion
 * Design baseado na imagem fornecida
 */
const Counter: React.FC = () => {
  const { address, disconnect, formatAddress } = useWallet();
  const { saveScore, getUserStats, isLoading } = useBlockchain();
  const [count, setCount] = useState(0);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [leaderboard] = useState([
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
        if (stats?.totalCoins) {
          setCount(stats.totalCoins);
        }
      }
    };
    loadUserStats();
  }, [address, getUserStats]);

  // Salvar na blockchain real
  const saveToBlockchain = async (value: number) => {
    const success = await saveScore(value);
    if (success) {
      toast.success(`Valor ${value} salvo na blockchain Xion!`);
      // Recarregar estatísticas após salvar
      const stats = await getUserStats();
      setUserStats(stats);
    }
  };

  const handleClick = () => {
    const newValue = count + 1;
    setCount(newValue);
    saveToBlockchain(newValue);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Card principal */}
        <Card className="border-4 border-gray-800 rounded-3xl shadow-2xl bg-white">
          <CardContent className="p-8 text-center space-y-8">
            {/* Título */}
            <h1 className="text-3xl font-bold text-black">
              Contador XION
            </h1>

            {/* Display do contador */}
            <div className="text-8xl font-bold text-purple-600">
              {count}
            </div>
            
            <div className="text-lg text-gray-600">
              Valor atual do Contador
            </div>

            {/* Botão circular grande */}
            <button
              onClick={handleClick}
              disabled={isLoading}
              className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white text-4xl font-bold shadow-2xl hover:from-purple-600 hover:to-purple-800 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mx-auto block"
            >
              {isLoading ? 'Salvando...' : 'Click!'}
            </button>

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