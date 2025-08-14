/**
 * Tipos relacionados ao jogo
 */

export interface GameState {
  coins: number;
  groundWidth: number;
  groundHeight: number;
  isJumping: boolean;
  showCoin: boolean;
  lastJumpTime: number;
  totalJumps: number;
  isGameOver: boolean;
  isFalling: boolean;
}

export interface GameConfig {
  GROUND_DECAY_RATE: number;
  GROUND_INCREASE_RATE: number;
  MIN_GROUND_WIDTH: number;
  MAX_GROUND_WIDTH: number;
}

export interface GameStats {
  currentScore: number;
  bestScore: number;
  totalGames: number;
  averageScore: number;
}