/**
 * Tipos relacionados à blockchain e smart contracts
 */

export interface Player {
  address: string;
  score: number;
  rank: number;
}

export interface UserStats {
  totalGames: number;
  bestScore: number;
  totalCoins: number;
  rank: number;
}

export interface GameResult {
  score: number;
  timestamp: number;
  transactionHash?: string;
}

export interface ContractInfo {
  codeId: string;
  address: string;
  admin?: string;
}

export interface BlockchainConfig {
  network: string;
  rpcEndpoint: string;
  codeId: string;
  contractAddress: string;
  treasuryAddress: string;
  treasuryAdmin: string;
  appUrl: string;
}