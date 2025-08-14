import React from 'react';
import { GameState } from '../types/game';

interface GameAreaProps {
  gameState: GameState;
  onJump: () => void;
}

/**
 * Componente da área principal do jogo
 * Contém Mario, o bloco de pergunta e o chão
 */
export const GameArea: React.FC<GameAreaProps> = ({ gameState, onJump }) => {
  return (
    <div className="flex items-end justify-center h-screen pb-20 px-4">
      <div className="relative flex flex-col items-center">
        {/* Question Block - positioned above Mario */}
        <div className="mb-4">
          <div className="w-12 h-12 bg-mario-block border-2 border-mario-brown shadow-lg rounded-sm relative">
            <div className="w-full h-full bg-gradient-to-br from-mario-gold to-mario-block flex items-center justify-center rounded-sm">
              <span className="text-mario-brown font-bold text-lg font-pixel">?</span>
            </div>
          </div>
        </div>

        {/* Floating Coin */}
        {gameState.showCoin && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 animate-fade-in z-20">
            <div className="w-6 h-6 bg-mario-gold rounded-full border border-mario-brown shadow-lg animate-bounce">
              <div className="w-full h-full bg-gradient-to-br from-mario-gold to-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-mario-brown font-bold text-xs">¢</span>
              </div>
            </div>
          </div>
        )}

        {/* Mario Character */}
        <div className="relative mb-2">
          <div 
            className={`w-12 h-12 cursor-pointer transition-all duration-300 relative z-10 ${
              gameState.isGameOver ? 'opacity-70' : 
              gameState.isJumping ? 'animate-mario-jump' : 'hover:scale-105'
            } ${gameState.isFalling ? 'animate-bounce' : ''}`}
            onClick={gameState.isGameOver ? undefined : onJump}
            style={{ 
              transform: `${gameState.isJumping && !gameState.isGameOver ? 'translateY(-40px)' : ''}
                          ${gameState.isFalling ? 'translateY(50px)' : ''}`,
              transition: gameState.isFalling ? 'transform 1s ease-in' : 'transform 0.3s ease-out'
            }}
          >
            <div className={`w-full h-full rounded border-2 border-mario-brown shadow-lg ${
              gameState.isGameOver ? 'bg-gray-600' : 'bg-mario-red'
            }`}>
              <div className={`w-full h-full rounded flex items-center justify-center ${
                gameState.isGameOver ? 'bg-gradient-to-br from-gray-600 to-gray-800' : 'bg-gradient-to-br from-mario-red to-red-700'
              }`}>
                <span className="text-white font-bold text-sm font-pixel">
                  {gameState.isGameOver ? '💀' : 'M'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ground Platform - Mario stands on this */}
        <div className="relative">
          <div 
            className="bg-mario-ground border-2 border-mario-brown transition-all duration-1000 relative overflow-hidden rounded-sm"
            style={{ 
              height: '40px',
              width: '400px'
            }}
          >
            {/* Ground that shrinks from right to left */}
            <div 
              className="h-full transition-all duration-1000 ease-linear rounded-sm"
              style={{ 
                width: `${gameState.groundWidth}%`,
                background: gameState.isGameOver ? 
                  'linear-gradient(to bottom, #991b1b, #7f1d1d)' : 
                  'linear-gradient(to bottom, #22c55e, #16a34a)',
                marginLeft: 'auto'
              }}
            />
            
            {/* Erosion effect on the left side */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-sm overflow-hidden">
              <div 
                className="w-full h-full transition-all duration-1000"
                style={{
                  background: `linear-gradient(90deg, 
                    rgba(220, 38, 38, 0.4) 0%, 
                    rgba(220, 38, 38, 0.2) ${Math.max(0, gameState.groundWidth - 10)}%, 
                    transparent ${gameState.groundWidth}%)`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};