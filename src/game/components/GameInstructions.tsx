import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Componente com as instruções do jogo
 * Mostra como jogar
 */
export const GameInstructions: React.FC = () => {
  return (
    <div className="absolute top-20 left-4">
      <Card className="bg-white/90 backdrop-blur max-w-xs">
        <CardContent className="p-3 text-sm text-mario-brown space-y-1">
          <div>🎯 Clique no Mario para pular e bater no bloco</div>
          <div>🪙 Ganhe moedas a cada pulo bem-sucedido</div>
          <div>🏃 O chão diminui da direita para esquerda</div>
          <div>🔥 Sem limite de pulos - clique rapidamente!</div>
          <div>⚠️ Game over quando o chão chegar a 15%!</div>
        </CardContent>
      </Card>
    </div>
  );
};