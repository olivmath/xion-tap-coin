# 🎮 Xion Tap-to-Earn Game

Um jogo **Tap-to-Earn** estilo 8-bit minimalista integrado à blockchain **Xion**. Os jogadores têm 10 segundos para clicar o máximo possível e salvar sua pontuação na blockchain, competindo em um ranking global.

## ✨ Características Principais

- 🎯 **Jogo Tap-to-Earn**: 10 segundos de cliques intensos
- 🏆 **Ranking Global**: Leaderboard salvo na blockchain Xion
- 🎨 **Design 8-bit**: Interface minimalista com apenas 5 cores
- 🔗 **Integração Xion**: Conexão via Abstraxion wallet
- ⚡ **Performance**: Arquitetura otimizada e responsiva
- 🏗️ **Arquitetura Limpa**: Separação clara de responsabilidades

## 🎮 Como Jogar

1. **Conecte sua wallet Xion** através do Abstraxion
2. **Clique em "START GAME"** para iniciar o contador de 10 segundos
3. **Clique rapidamente** na área de jogo para aumentar sua pontuação
4. **Sua pontuação é automaticamente salva** na blockchain quando o tempo acaba
5. **Veja sua posição** no ranking global de jogadores

## 📁 Estrutura do Projeto

```
src/
├── blockchain/                 # Lógica da blockchain Xion
│   ├── config/
│   │   └── xion.ts            # Configurações da rede
│   ├── hooks/
│   │   ├── useWallet.ts       # Hook de gerenciamento da wallet
│   │   └── useBlockchain.ts   # Hook de interações blockchain
│   ├── services/
│   │   └── XionBlockchainService.ts # Serviço centralizado
│   └── types/
│       └── blockchain.ts      # Tipos TypeScript
├── components/
│   ├── ui/                    # Componentes base (shadcn/ui)
│   ├── Counter.tsx            # Componente principal do jogo
│   └── WalletLogin.tsx        # Tela de conexão da wallet
├── contexts/
│   └── XionContext.tsx        # Contexto global do Xion
├── pages/
│   └── Index.tsx              # Página principal
├── lib/
│   └── utils.ts               # Utilitários
└── App.tsx                    # Componente raiz
```

## 🛠️ Stack Tecnológico

### Frontend Core
- **React 18** - Framework frontend moderno
- **TypeScript** - Tipagem estática para maior robustez
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Framework CSS utilitário

### Blockchain Integration
- **@burnt-labs/abstraxion** - SDK oficial para Xion blockchain
- **@tanstack/react-query** - Gerenciamento de estado e cache
- **CosmJS** - Biblioteca para interação com Cosmos SDK

### UI/UX Components
- **shadcn/ui** - Componentes acessíveis e customizáveis
- **Lucide React** - Ícones modernos e consistentes
- **Sonner** - Sistema de notificações elegante
- **Press Start 2P** - Fonte 8-bit autêntica

### Development Tools
- **ESLint** - Linting e qualidade de código
- **PostCSS** - Processamento de CSS
- **Autoprefixer** - Compatibilidade cross-browser

## 🚀 Instalação e Uso

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Wallet Xion (Abstraxion)

### Instalação
```bash
# Clone o repositório
git clone <repository-url>
cd cw-counter/frontend

# Instale as dependências
npm install --legacy-peer-deps
```

### Configuração
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_NETWORK=xion-testnet-2
VITE_RPC_ENDPOINT=https://rpc.xion-testnet-2.burnt.com:443
VITE_CODE_ID=1431
VITE_CONTRACT_ADDRESS=xion14yu57e3xh0f9j4xqy8ed635074749np8auq0969vhjzq532zacds7rl382
VITE_TREASURY_ADDRESS=xion1apgmwm45uqf9wcrzdk4uyz24x645w9ltrqgtqpt7ek6z3rnrj2zszmma52
```

### Desenvolvimento
```bash
npm run dev
# Acesse http://localhost:8080
```

### Build para Produção
```bash
npm run build
npm run preview
```

## 🎯 Funcionalidades do Jogo

### 🔐 Sistema de Autenticação
- Conexão segura via Abstraxion wallet
- Suporte completo à blockchain Xion
- Interface de login minimalista 8-bit

### 🎮 Mecânicas do Jogo
- **Timer de 10 segundos**: Pressão temporal para máxima pontuação
- **Cliques ilimitados**: Sem limite de velocidade de clique
- **Salvamento automático**: Pontuação salva na blockchain ao final
- **Feedback visual**: Animações e efeitos sonoros (toast)

### 🏆 Sistema de Ranking
- **Leaderboard global**: Ranking de todos os jogadores
- **Persistência blockchain**: Dados imutáveis na Xion
- **Atualização em tempo real**: Ranking atualizado após cada jogo

## 🏗️ Arquitetura do Projeto

### Padrão de Design
O projeto segue uma **arquitetura limpa** com separação clara de responsabilidades:

- **Presentation Layer**: Componentes React puros
- **Business Logic**: Hooks customizados para regras de negócio
- **Data Layer**: Serviços de blockchain e gerenciamento de estado
- **Infrastructure**: Configurações e utilitários

### Hooks Customizados
```typescript
// Gerenciamento da wallet
const { address, connect, disconnect } = useWallet();

// Interações com blockchain
const { saveScore, getLeaderboard } = useBlockchain();

// Contexto global
const { isConnected } = useXion();
```

## 🎨 Design System 8-bit

### Paleta de Cores Minimalista
```css
--pixel-black: 0 0% 0%;      /* #000000 */
--pixel-white: 0 0% 100%;    /* #FFFFFF */
--pixel-red: 0 100% 50%;     /* #FF0000 */
--pixel-green: 120 100% 25%; /* #008000 */
--pixel-yellow: 60 100% 50%; /* #FFFF00 */
```

### Princípios de Design
- **Minimalismo**: Apenas 5 cores permitidas
- **Pixel Perfect**: Bordas retas, sem arredondamentos
- **Tipografia**: Fonte "Press Start 2P" autêntica
- **Responsividade**: Funciona em todos os dispositivos

## 🔄 Fluxo da Aplicação

```mermaid
graph TD
    A[Usuário acessa app] --> B[Tela de Login]
    B --> C[Conecta Wallet Xion]
    C --> D[Tela do Jogo]
    D --> E[Clica START GAME]
    E --> F[10 segundos de cliques]
    F --> G[Salva score na blockchain]
    G --> H[Atualiza leaderboard]
    H --> D
```

## 🔧 Configuração Avançada

### Variáveis de Ambiente
```env
# Rede Xion
VITE_NETWORK=xion-testnet-2
VITE_RPC_ENDPOINT=https://rpc.xion-testnet-2.burnt.com:443

# Smart Contract
VITE_CODE_ID=1431
VITE_CONTRACT_ADDRESS=xion14yu57e3xh0f9j4xqy8ed635074749np8auq0969vhjzq532zacds7rl382

# Treasury
VITE_TREASURY_ADDRESS=xion1apgmwm45uqf9wcrzdk4uyz24x645w9ltrqgtqpt7ek6z3rnrj2zszmma52
```

### Customização do Tema
Para personalizar cores e estilos:
1. Edite `src/index.css` para alterar variáveis CSS
2. Modifique `tailwind.config.ts` para novos utilitários
3. Ajuste componentes em `src/components/`

## 🚀 Deploy e Produção

### Build Otimizado
```bash
# Build para produção
npm run build

# Preview local
npm run preview

# Análise do bundle
npm run build -- --analyze
```

### Hospedagem Recomendada
- **Vercel**: Deploy automático via Git
- **Netlify**: Integração contínua
- **GitHub Pages**: Hospedagem gratuita
- **IPFS**: Descentralizado

## 📊 Performance

- ⚡ **Vite**: Build ultra-rápido
- 🗜️ **Tree Shaking**: Bundle otimizado
- 📱 **Mobile First**: Responsivo por padrão
- 🔄 **React Query**: Cache inteligente
- 🎯 **Code Splitting**: Carregamento sob demanda

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**🎮 Desenvolvido com ❤️ para a blockchain Xion**  
*Um exemplo prático de integração Web3 com design 8-bit autêntico*
