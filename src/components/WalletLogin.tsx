import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useXion } from '@/contexts/XionContext';
import { Abstraxion, useModal } from '@burnt-labs/abstraxion';
import { Wallet } from 'lucide-react';

const WalletLogin: React.FC = () => {
  const { isConnected } = useXion();
  const [showModal, setShowModal] = useModal();

  if (isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md border-4 border-cyan-400 bg-gray-900 shadow-2xl" style={{
        borderRadius: '0px',
        boxShadow: '0 0 20px #00ffff, inset 0 0 20px rgba(0, 255, 255, 0.1)'
      }}>
        <div className="text-center space-y-6 p-8">
          <div className="mx-auto w-20 h-20 bg-yellow-500 border-4 border-yellow-300 flex items-center justify-center" style={{
            boxShadow: '0 0 20px #ffff00'
          }}>
            <Wallet className="w-10 h-10 text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-cyan-400 tracking-wider mb-2" style={{
              fontFamily: 'monospace',
              textShadow: '0 0 10px #00ffff, 2px 2px 0px #0066cc'
            }}>
              TAP-TO-EARN
            </h1>
            <div className="text-sm text-yellow-400 tracking-widest" style={{
              fontFamily: 'monospace',
              textShadow: '0 0 5px #ffff00'
            }}>
              ⚡ BLOCKCHAIN GAME ⚡
            </div>
          </div>
          <div className="text-cyan-300" style={{
            fontFamily: 'monospace',
            textShadow: '0 0 5px #00ffff'
          }}>
            Connect your XION wallet to start earning!
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="w-full h-16 bg-green-600 border-4 border-green-400 text-white text-xl font-bold transition-all duration-100 transform active:scale-95"
            style={{
              fontFamily: 'monospace',
              textShadow: '2px 2px 0px #004400',
              boxShadow: '0 6px 0px #004400, 0 0 20px #00ff00'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(3px)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
          >
            CONNECT WALLET
          </button>
          <Abstraxion onClose={() => setShowModal(false)} />
          <div className="text-center text-sm text-purple-400" style={{
             fontFamily: 'monospace',
             textShadow: '0 0 5px #8800ff'
           }}>
             {'>>> POWERED BY XION NETWORK <<<'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletLogin;