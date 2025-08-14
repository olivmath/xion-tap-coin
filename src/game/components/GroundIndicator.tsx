import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface GroundIndicatorProps {
  groundWidth: number;
}

/**
 * Componente que mostra o indicador do chão
 * Exibe a porcentagem restante do chão
 */
export const GroundIndicator: React.FC<GroundIndicatorProps> = ({ groundWidth }) => {
  return (
    <div className="absolute bottom-4 left-4">
      <Card className="bg-white/90 backdrop-blur">
        <CardContent className="p-3">
          <div className="text-sm font-pixel text-mario-brown">
            Chão: {Math.round(groundWidth)}%
          </div>
          <div className="w-20 h-2 bg-gray-300 rounded mt-1">
            <div 
              className={`h-full rounded transition-all ${
                groundWidth <= 25 ? 'bg-red-500' : 'bg-mario-ground'
              }`}
              style={{ width: `${groundWidth}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};