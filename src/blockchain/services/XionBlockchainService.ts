import { XION_CONFIG } from '../config/xion';
import { Player, UserStats } from '../types/blockchain';

/**
 * Serviço para interações com a blockchain Xion
 * Centraliza toda a lógica de comunicação com smart contracts
 */
export class XionBlockchainService {
  private client: any;
  private contractAddress: string;

  constructor(client: any) {
    this.client = client;
    this.contractAddress = XION_CONFIG.contractAddress;
  }

  /**
   * Salva a pontuação do jogador na blockchain
   */
  async saveScore(address: string, score: number): Promise<void> {
    try {
      if (!this.client) {
        throw new Error('Cliente não conectado');
      }

      console.log('Salvando pontuação na blockchain:', {
        player: address,
        score,
        timestamp: Date.now(),
        contract: this.contractAddress
      });

      // Executar transação no smart contract usando a função NewGame
      const result = await this.client.execute(
        address,
        this.contractAddress,
        { 
          new_game: { 
            player: address,
            score: score,
            game_time: 10 // Tempo fixo de 10 segundos por enquanto
          } 
        },
        'auto'
      );

      console.log('Transação executada:', result);
    } catch (error) {
      console.error('Erro ao salvar pontuação:', error);
      throw new Error('Falha ao salvar pontuação na blockchain');
    }
  }

  /**
   * Busca o ranking de jogadores
   */
  async getLeaderboard(): Promise<Player[]> {
    try {
      if (!this.client) {
        throw new Error('Cliente não conectado');
      }

      // Consultar o smart contract para obter o ranking
      const result = await this.client.queryContractSmart(
        this.contractAddress,
        { get_rank: {} }
      );

      console.log('Ranking obtido do contrato:', result);

      // Converter o resultado do contrato para o formato esperado
      const players: Player[] = result.rank.map((item: [number, string], index: number) => ({
        address: this.formatAddress(item[1]),
        score: item[0],
        rank: index + 1
      }));

      return players;
    } catch (error) {
      console.error('Erro ao buscar leaderboard:', error);
      // Retornar dados mock em caso de erro
      const mockPlayers: Player[] = [
        { address: 'xion1abc...def', score: 1250, rank: 1 },
        { address: 'xion1ghi...jkl', score: 980, rank: 2 },
        { address: 'xion1mno...pqr', score: 750, rank: 3 },
      ];
      return mockPlayers;
    }
  }

  /**
   * Formata endereço para exibição
   */
  private formatAddress(address: string): string {
    if (address.length <= 12) return address;
    return `${address.slice(0, 8)}...${address.slice(-4)}`;
  }

  /**
   * Busca estatísticas do usuário
   */
  async getUserStats(address: string): Promise<UserStats> {
    try {
      if (!this.client) {
        throw new Error('Cliente não conectado');
      }

      // Buscar pontuação do jogador específico
      const scoreResult = await this.client.queryContractSmart(
        this.contractAddress,
        { get_score_by_player: { player: address } }
      );

      // Buscar total de jogos
      const totalResult = await this.client.queryContractSmart(
        this.contractAddress,
        { get_total: {} }
      );

      // Buscar ranking para calcular posição do usuário
      const rankResult = await this.client.queryContractSmart(
        this.contractAddress,
        { get_rank: {} }
      );

      console.log('Estatísticas do usuário:', { scoreResult, totalResult, rankResult });

      // Calcular posição do usuário no ranking
      const userRank = rankResult.rank.findIndex((item: [number, string]) => item[1] === address) + 1;

      return {
        totalGames: 1, // Por enquanto 1, pois o contrato armazena apenas o último jogo por jogador
        bestScore: scoreResult.score,
        totalCoins: scoreResult.score * 5, // Multiplicador para coins
        rank: userRank || 999 // Se não encontrado no ranking, posição alta
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      // Retornar estatísticas padrão em caso de erro
      return {
        totalGames: 0,
        bestScore: 0,
        totalCoins: 0,
        rank: 999
      };
    }
  }

  /**
   * Verifica se o contrato está disponível
   */
  async isContractAvailable(): Promise<boolean> {
    try {
      if (!this.client) return false;
      
      // Verificar se o contrato responde a uma consulta básica
      await this.client.queryContractSmart(
        this.contractAddress,
        { get_total: {} }
      );
      
      return true;
    } catch (error) {
      console.error('Contrato não disponível:', error);
      return false;
    }
  }
}