import React from 'react';
import { useXion } from '@/contexts/XionContext';
import { Abstraxion, useModal } from '@burnt-labs/abstraxion';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

const WalletLogin: React.FC = () => {
  const { isConnected } = useXion();
  const [showModal, setShowModal] = useModal();

  const connectButton = useKeyboardNavigation<HTMLButtonElement>({
    onSpacePress: () => setShowModal(true),
    onEnterPress: () => setShowModal(true)
  });

  if (isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pixel-bg" style={{
      backgroundColor: 'hsl(var(--pixel-black))'
    }}>
      <div className="w-full max-w-md pixel-border" style={{
        backgroundColor: 'hsl(var(--pixel-black))'
      }}>
        <div className="text-center space-y-8 p-8">
          {/* Ícone 8-bit simples */}
          <div className="mx-auto w-16 h-16 pixel-border flex items-center justify-center" style={{
            backgroundColor: 'hsl(var(--pixel-white))'
          }}>
            <div className="w-8 h-8" style={{
              backgroundColor: 'hsl(var(--pixel-black))',
              clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'
            }}></div>
          </div>
          
          {/* Título */}
          <div>
            <h1 className="text-2xl font-bold pixel-shadow mb-3" style={{
              color: 'hsl(var(--pixel-white))'
            }}>
              TAP-TO-EARN
            </h1>
            <div className="text-xs" style={{
              color: 'hsl(var(--pixel-yellow))'
            }}>
              ▲ BLOCKCHAIN GAME ▲
            </div>
          </div>
          
          {/* Descrição */}
          <div className="text-sm" style={{
            color: 'hsl(var(--pixel-white))'
          }}>
            CONNECT XION WALLET
          </div>
          
          {/* Botão de conexão */}
          <button 
            ref={connectButton.elementRef}
            onClick={() => setShowModal(true)}
            className={`w-full h-16 btn-primary pixel-border text-lg font-bold ${connectButton.className}`}
            style={{
              boxShadow: '4px 4px 0px hsl(var(--pixel-black))'
            }}
          >
            CONNECT WALLET
          </button>
          
          {/* Instruções de teclado */}
          <div className="text-xs" style={{
            color: 'hsl(var(--pixel-green))'
          }}>
            PRESS SPACE OR ENTER
          </div>
          
          <Abstraxion onClose={() => setShowModal(false)} />
          
          {/* Footer */}
          <div className="text-xs" style={{
            color: 'hsl(var(--pixel-white))'
          }}>
            POWERED BY XION
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletLogin;