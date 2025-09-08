# 🎮 Xion Tap-to-Earn Smart Contract

Este é um smart contract CosmWasm desenvolvido para o jogo Tap-to-Earn na blockchain Xion. O contrato gerencia pontuações de jogadores, rankings globais e estatísticas de jogos de forma descentralizada e transparente.

## 🏗️ Arquitetura do Contrato

### Estrutura Modular

O contrato segue uma arquitetura modular limpa, organizada nos seguintes módulos:

```
src/
├── contract.rs          # Entry points principais (instantiate, execute, query)
├── error.rs            # Definições de erros customizados
├── handlers/           # Lógica de negócio
│   ├── execute.rs      # Handlers para operações de escrita
│   ├── query.rs        # Handlers para consultas
│   └── mod.rs          # Módulo principal dos handlers
├── msg/                # Definições de mensagens
│   ├── execute.rs      # Mensagens de execução
│   ├── query.rs        # Mensagens de consulta
│   ├── response.rs     # Estruturas de resposta
│   ├── instantiate.rs  # Mensagem de inicialização
│   └── mod.rs          # Módulo principal das mensagens
├── state/              # Gerenciamento de estado
│   ├── model.rs        # Modelos de dados
│   ├── storage.rs      # Definições de armazenamento
│   └── mod.rs          # Módulo principal do estado
└── lib.rs              # Biblioteca principal
```

## 🎯 Funcionalidades do Contrato

### Sistema de Jogos
- **Registro de Partidas**: Armazena pontuação e tempo de jogo para cada jogador
- **Ranking Global**: Mantém um ranking ordenado por pontuação (maior para menor)
- **Estatísticas Globais**: Conta o total de jogos registrados no contrato

### Operações Disponíveis

#### Execute Messages
- `NewGame`: Registra uma nova partida com pontuação e tempo

#### Query Messages
- `GetRank`: Retorna o ranking global de jogadores
- `GetScoreByPlayer`: Consulta a pontuação de um jogador específico
- `GetTotal`: Retorna o número total de jogos registrados

## 📊 Modelo de Dados

### Game Structure
```rust
pub struct Game {
    pub score: u64,      // Pontuação do jogador
    pub game_time: u64,  // Tempo de duração do jogo
}
```

### Storage Layout
- `GAMES`: Map<Addr, Game> - Armazena jogos por endereço do jogador
- `RANK`: Item<Vec<(u64, Addr)>> - Ranking global (pontuação, endereço)
- `TOTAL`: Item<u64> - Contador total de jogos

## 🛠️ Stack Tecnológico

### Core Blockchain
- **CosmWasm**: Framework para smart contracts no ecossistema Cosmos
- **Rust**: Linguagem de programação para máxima performance e segurança
- **Xion Blockchain**: Blockchain focada em abstração de conta e UX

### Dependências Principais
- **cosmwasm-std**: Biblioteca padrão do CosmWasm
- **cw-storage-plus**: Utilitários avançados de armazenamento
- **cosmwasm-schema**: Geração automática de schemas JSON
- **serde**: Serialização e deserialização de dados
- **thiserror**: Tratamento elegante de erros

## 🚀 Instalação e Deploy

### Pré-requisitos

1. **XION Daemon (`xiond`)**
   ```bash
   # Siga o guia oficial para instalação
   # https://docs.burnt.com/xion/developers/featured-guides/setup-local-environment/interact-with-xion-chain-setup-xion-daemon
   ```

2. **Docker**
   ```bash
   # Instale o Docker para compilação otimizada
   # https://www.docker.com/get-started
   ```

3. **Rust Toolchain**
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   rustup target add wasm32-unknown-unknown
   ```

### Compilação e Otimização

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd cw-counter/contracts
   ```

2. **Compile e otimize o contrato**
   ```bash
   docker run --rm -v "$(pwd)":/code \
     --mount type=volume,source="$(basename "$(pwd)")_cache",target=/target \
     --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
     cosmwasm/optimizer:0.16.0
   ```

3. **Artefato gerado**
   ```
   artifacts/cw_counter.wasm
   ```

### Deploy do Contrato

1. **Configure as variáveis de ambiente**
   ```bash
   # Crie um arquivo .env.deploy
   cp .env.deploy.example .env.deploy
   
   # Configure suas credenciais
   MNEMONIC="sua mnemonic phrase aqui"
   CHAIN_ID="xion-testnet-1"
   RPC_URL="https://testnet-rpc.xion-api.com"
   ```

2. **Execute o script de deploy**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

3. **Verifique o deploy**
   ```bash
   # O endereço do contrato será salvo em deploy.txt
   cat deploy.txt
   ```

### Interação com o Contrato

#### Consultas (Queries)

```bash
# Obter ranking global
xiond query wasm contract-state smart <CONTRACT_ADDRESS> '{"get_rank":{}}'

# Obter pontuação de um jogador
xiond query wasm contract-state smart <CONTRACT_ADDRESS> '{"get_score_by_player":{"player":"<PLAYER_ADDRESS>"}}'

# Obter total de jogos
xiond query wasm contract-state smart <CONTRACT_ADDRESS> '{"get_total":{}}'
```

#### Execuções (Transactions)

```bash
# Registrar nova partida
xiond tx wasm execute <CONTRACT_ADDRESS> '{
  "new_game": {
    "player": "<PLAYER_ADDRESS>",
    "score": 1500,
    "game_time": 10
  }
}' --from <YOUR_WALLET> --gas auto --gas-adjustment 1.3 --fees 5000uxion
```

## 🧪 Testes

### Executar Testes

```bash
# Testes unitários
cargo test

# Testes com output detalhado
cargo test -- --nocapture

# Testes de integração
cargo test --test integration_tests
```

### Cobertura de Testes

Os testes cobrem:
- ✅ Inicialização do contrato
- ✅ Registro de novas partidas
- ✅ Atualização do ranking
- ✅ Consultas de pontuação
- ✅ Consultas de ranking
- ✅ Tratamento de erros

## 🔧 Desenvolvimento

### Estrutura de Desenvolvimento

```bash
# Verificar formatação
cargo fmt --check

# Aplicar formatação
cargo fmt

# Verificar linting
cargo clippy

# Verificar compilação
cargo check
```

### Debugging

```bash
# Compilar com informações de debug
cargo build --features backtraces

# Executar testes com backtraces
RUST_BACKTRACE=1 cargo test
```

## 📈 Performance e Otimização

### Otimizações Implementadas
- **Armazenamento Eficiente**: Uso de `cw-storage-plus` para operações otimizadas
- **Ranking Ordenado**: Algoritmo de inserção ordenada para manter performance
- **Serialização Mínima**: Estruturas de dados compactas
- **Gas Optimization**: Operações otimizadas para menor consumo de gas

### Métricas de Gas
- **Instantiate**: ~150,000 gas
- **NewGame**: ~80,000 gas
- **GetRank**: ~30,000 gas
- **GetScoreByPlayer**: ~25,000 gas

## 🔒 Segurança

### Práticas de Segurança Implementadas
- **Validação de Entrada**: Todas as entradas são validadas
- **Overflow Protection**: Proteção contra overflow em operações numéricas
- **Access Control**: Controle de acesso adequado para operações sensíveis
- **Error Handling**: Tratamento robusto de erros

### Auditoria
- ✅ Revisão de código interno
- ✅ Testes de stress
- ✅ Verificação de vulnerabilidades conhecidas

## 📚 Recursos e Documentação

### Documentação Oficial
- [CosmWasm Book](https://book.cosmwasm.com/)
- [XION Developer Docs](https://docs.burnt.com/)
- [Rust Documentation](https://doc.rust-lang.org/)

### Tutoriais Recomendados
- [CosmWasm Academy](https://academy.cosmwasm.com/)
- [Building on XION](https://docs.burnt.com/xion/developers/)

## 🤝 Contribuição

### Como Contribuir

1. **Fork o repositório**
2. **Crie uma branch para sua feature**
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
3. **Implemente suas mudanças**
4. **Execute os testes**
   ```bash
   cargo test
   ```
5. **Submeta um Pull Request**

### Diretrizes de Contribuição
- Siga as convenções de código Rust
- Adicione testes para novas funcionalidades
- Mantenha a documentação atualizada
- Use commits semânticos

## 📄 Licença

Este projeto está licenciado sob a **Apache 2.0 License**. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido com ❤️ para o ecossistema Xion**
