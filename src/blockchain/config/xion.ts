import { BlockchainConfig } from '../types/blockchain';

/**
 * Configuração da blockchain Xion
 * Centraliza todas as configurações relacionadas à rede
 */
export const XION_CONFIG: BlockchainConfig = {
  network: import.meta.env.VITE_NETWORK || 'xion-testnet-2',
  rpcEndpoint: import.meta.env.VITE_RPC_ENDPOINT || 'https://rpc.xion-testnet-2.burnt.com:443',
  codeId: import.meta.env.VITE_CODE_ID || '1431',
  contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS || 'xion14yu57e3xh0f9j4xqy8ed635074749np8auq0969vhjzq532zacds7rl382',
  treasuryAddress: import.meta.env.VITE_TREASURY_ADDRESS || 'xion1apgmwm45uqf9wcrzdk4uyz24x645w9ltrqgtqpt7ek6z3rnrj2zszmma52',
  treasuryAdmin: 'xion16wv294qw7chfspmek2nq3tdntu0n6r93aqp7vud8a2h27hf4kfxqd4qsqk',
  appUrl: 'https://preview--xion-tap-coin.lovable.app',
} as const;

/**
 * Configuração para o AbstraxionProvider
 */
export const getTreasuryConfig = () => ({
  treasury: XION_CONFIG.treasuryAddress,
});