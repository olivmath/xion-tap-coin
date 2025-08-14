import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GameOverModalProps {
  isVisible: boolean;
  finalScore: number;
  onRestart: () => void;
  isSaving?: boolean;
}

/**
 * Modal de Game Over
 * Mostra pontuação final e opção de reiniciar
 */
export const GameOverModal: React.FC<GameOverModalProps> = ({ 
  isVisible, 
  finalScore, 
  onRestart, 
  isSaving = false 
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="bg-white/95 backdrop-blur max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-pixel text-mario-red">
            Game Over! 💀
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-lg font-pixel text-mario-brown">
            Pontuação Final: {finalScore} moedas! 🪙
          </div>
          <div className="text-sm text-mario-brown/70">
            {isSaving ? (
              'Salvando na blockchain XION...'
            ) : (
              'Pontuação salva na blockchain XION'
            )}
          </div>
          <Button 
            onClick={onRestart}
            disabled={isSaving}
            className="w-full bg-mario-red hover:bg-mario-red/90 text-white font-pixel"
          >
            {isSaving ? 'Salvando...' : 'Jogar Novamente'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};