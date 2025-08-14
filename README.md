# Frontend Contador Xion

Um frontend simples e minimalista para interagir com a blockchain Xion através de um contador.

## 🚀 Características

- **Interface Simples**: Apenas tela de login e contador
- **Conexão Xion**: Integração com a blockchain Xion via Abstraxion
- **Design Moderno**: Interface limpa e responsiva com Tailwind CSS
- **Poucos Arquivos**: Estrutura simplificada e fácil de manter

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx          # Componente de botão
│   │   ├── card.tsx            # Componente de card
│   │   └── sonner.tsx          # Componente de toast
│   ├── Counter.tsx             # Componente principal do contador
│   └── WalletLogin.tsx         # Componente de login da wallet
├── contexts/
│   └── XionContext.tsx         # Contexto para gerenciar conexão Xion
├── config/
│   └── xion.ts                 # Configuração da blockchain Xion
├── pages/
│   └── Index.tsx               # Página principal
├── lib/
│   └── utils.ts                # Utilitários
└── App.tsx                     # Componente raiz
```

## 🛠️ Tecnologias

### Principais
- **React 18** - Framework frontend
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS

### Blockchain
- **@burnt-labs/abstraxion** - Conexão com Xion
- **@tanstack/react-query** - Gerenciamento de estado

### UI/UX
- **Lucide React** - Ícones
- **Sonner** - Notificações toast
- **Radix UI** - Componentes base

## 🚀 Como Usar

### Instalação
```bash
npm install --legacy-peer-deps
```

### Desenvolvimento
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## 🎯 Funcionalidades

### Tela de Login
- Conecta com wallet Xion via Abstraxion
- Interface simples e intuitiva

### Contador
- **Incrementar**: Botão `+` para aumentar o valor
- **Decrementar**: Botão `-` para diminuir o valor
- **Reset**: Botão para zerar o contador
- **Salvamento**: Simula salvamento na blockchain Xion
- **Feedback**: Notificações de sucesso/erro

## 🔧 Configuração

O arquivo `src/config/xion.ts` contém as configurações da blockchain:

```typescript
export const XION_CONFIG = {
  treasuryAddress: 'xion1h4l8zl0yz8hqzpjxlmqn5n5n5n5n5n5n5n5n5n',
};
```

## 📱 Interface

- **Design Responsivo**: Funciona em desktop e mobile
- **Tema Claro**: Interface limpa e moderna
- **Feedback Visual**: Loading states e notificações
- **Acessibilidade**: Componentes acessíveis

## 🔄 Fluxo da Aplicação

1. **Usuário acessa a aplicação**
2. **Tela de login é exibida**
3. **Usuário conecta wallet Xion**
4. **Contador é exibido**
5. **Usuário pode incrementar/decrementar/resetar**
6. **Valores são "salvos" na blockchain**

## 🎨 Customização

### Cores e Tema
Edite as classes Tailwind nos componentes para personalizar:
- `bg-gradient-to-br from-blue-50 to-indigo-100` - Gradiente de fundo
- `text-indigo-600` - Cor do contador
- `bg-blue-600` - Cor dos botões

### Funcionalidades
Para adicionar novas funcionalidades:
1. Edite `src/components/Counter.tsx`
2. Adicione novos métodos no contexto `XionContext.tsx`
3. Implemente a lógica de blockchain conforme necessário

## 📦 Dependências Mínimas

O projeto foi otimizado para usar apenas as dependências essenciais:
- Abstraxion para Xion
- React Query para estado
- Tailwind para styling
- Lucide para ícones
- Sonner para notificações

## 🚀 Deploy

Para fazer deploy:
1. Execute `npm run build`
2. Faça upload da pasta `dist/` para seu servidor
3. Configure o servidor para servir arquivos estáticos

---

**Desenvolvido com ❤️ para a blockchain Xion**
