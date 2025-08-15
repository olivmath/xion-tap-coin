import { XION_CONFIG } from "../config/xion";
import { Player, UserStats } from "../types/blockchain";

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
        throw new Error("Cliente não conectado");
      }

      // Executar transação no smart contract usando a função NewGame
      const result = await this.client.execute(
        address,
        this.contractAddress,
        {
          new_game: {
            player: address,
            score: score,
            game_time: 10, // Tempo fixo de 10 segundos por enquanto
          },
        },
        "auto"
      );

      console.log("Resultado da transação:", result);
    } catch (error) {
      console.error("Erro ao salvar pontuação:", error);
      throw new Error("Falha ao salvar pontuação na blockchain");
    }
  }

  /**
   * Busca o ranking de jogadores
   */
  async getLeaderboard(): Promise<Player[]> {
    try {
      if (!this.client) {
        throw new Error("Cliente não conectado");
      }

      // Consultar o smart contract para obter o ranking
      const result = await this.client.queryContractSmart(
        this.contractAddress,
        { get_rank: {} }
      );

      // Converter o resultado do contrato para o formato esperado
      const players: Player[] = result.rank.map(
        (item: [number, string], index: number) => ({
          address: item[1],
          score: item[0],
          rank: index + 1,
        })
      );

      return players;
    } catch (error) {
      console.error("Erro ao buscar leaderboard:", error);
      return [];
    }
  }

  /**
   * Busca o total de jogos jogados
   */
  async totalGames(): Promise<number> {
    try {
      if (!this.client) return 0;

      // Verificar se o contrato responde a uma consulta básica
      const result = await this.client.queryContractSmart(
        this.contractAddress,
        {
          get_total: {},
        }
      );

      return result.total;
    } catch (error) {
      console.error("Contrato não disponível:", error);
      return 0;
    }
  }
}
