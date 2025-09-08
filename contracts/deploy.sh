#!/bin/bash

# Script de Deploy do Contrato CW Counter
# Baseado nas instruções do README.md

set -e  # Para o script se houver erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Network configuration - XION TESTNET
CHAIN_ID="xion-testnet-2"
RPC_ENDPOINT="https://rpc.xion-testnet-2.burnt.com:443"
GAS_DENOM="uxion"
GAS_PRICE="0.025"
STORE_GAS_PRICE="0.1"

echo -e "${BLUE}=== Script de Deploy do CW Counter (XION Testnet) ===${NC}"

# Verificar se o endereço da wallet foi fornecido
if [ -z "$1" ]; then
    echo -e "${RED}Erro: Endereço da wallet é obrigatório${NC}"
    echo "Uso: ./deploy.sh <wallet-address> [initial-count]"
    echo "Exemplo: ./deploy.sh xion1abc123... 1"
    exit 1
fi

WALLET="$1"

echo -e "${YELLOW}Network: XION Testnet (${CHAIN_ID})${NC}"
echo -e "${YELLOW}RPC: ${RPC_ENDPOINT}${NC}"
echo -e "${YELLOW}Wallet: $WALLET${NC}"
echo ""

# Verificar se o podman está rodando
if ! podman info > /dev/null 2>&1; then
    echo -e "${RED}Erro: podman não está rodando. Por favor, inicie o podman.${NC}"
    exit 1
fi

# Verificar se xiond está instalado
if ! command -v xiond &> /dev/null; then
    echo -e "${RED}Erro: xiond não está instalado. Instale seguindo: https://docs.burnt.com/xion/developers/featured-guides/setup-local-environment/interact-with-xion-chain-setup-xion-daemon${NC}"
    exit 1
fi

# Verificar se jq está instalado
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Erro: jq não está instalado. Instale com: brew install jq${NC}"
    exit 1
fi

# Verificar se a wallet tem saldo suficiente
echo -e "${BLUE}Verificando saldo da wallet...${NC}"
BALANCE=$(xiond query bank balances $WALLET --node $RPC_ENDPOINT --output json | jq -r '.balances[] | select(.denom == "uxion") | .amount')
if [ -z "$BALANCE" ] || [ "$BALANCE" = "null" ]; then
    echo -e "${RED}Erro: Não foi possível verificar o saldo ou wallet sem fundos${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Saldo verificado: $BALANCE uxion${NC}"
echo ""

echo -e "${BLUE}Passo 1: Compilando e otimizando o contrato...${NC}"

# Compilar e otimizar o contrato
podman run --rm -v "$(pwd)":/code \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/optimizer:0.16.0

if [ ! -f "./artifacts/cw_counter.wasm" ]; then
    echo -e "${RED}Erro: Arquivo cw_counter.wasm não foi gerado${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Contrato compilado e otimizado com sucesso${NC}"
echo ""

echo -e "${BLUE}Passo 2: Fazendo upload do bytecode para a blockchain...${NC}"

# Upload do contrato
RES=$(xiond tx wasm store ./artifacts/cw_counter.wasm \
      --chain-id $CHAIN_ID \
      --gas-adjustment 1.3 \
      --gas-prices ${STORE_GAS_PRICE}${GAS_DENOM} \
      --gas auto \
      -y --output json \
      --node $RPC_ENDPOINT \
      --from $WALLET)

echo -e "${YELLOW}Resposta do upload:${NC}"
echo $RES | jq .

# Extrair o transaction hash
TXHASH=$(echo $RES | jq -r '.txhash')

if [ "$TXHASH" = "null" ] || [ -z "$TXHASH" ]; then
    echo -e "${RED}Erro: Não foi possível obter o transaction hash${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Upload realizado com sucesso${NC}"
echo -e "${YELLOW}Transaction Hash: $TXHASH${NC}"
echo ""

echo -e "${BLUE}Aguardando confirmação da transação...${NC}"
sleep 15  # Aumentado para 15 segundos

echo -e "${BLUE}Passo 3: Obtendo o Code ID...${NC}"

# Obter o Code ID com retry
retry_count=0
max_retries=5
while [ $retry_count -lt $max_retries ]; do
    CODE_ID=$(xiond query tx $TXHASH \
      --node $RPC_ENDPOINT \
      --output json 2>/dev/null | jq -r '.events[] | select(.type == "store_code") | .attributes[] | select(.key == "code_id") | .value' 2>/dev/null)
    
    if [ "$CODE_ID" != "null" ] && [ -n "$CODE_ID" ]; then
        break
    fi
    
    retry_count=$((retry_count + 1))
    echo -e "${YELLOW}Tentativa $retry_count/$max_retries - Aguardando confirmação...${NC}"
    sleep 10
done

if [ "$CODE_ID" = "null" ] || [ -z "$CODE_ID" ]; then
    echo -e "${RED}Erro: Não foi possível obter o Code ID após $max_retries tentativas${NC}"
    echo "Verifique se a transação foi confirmada: xiond query tx $TXHASH --node $RPC_ENDPOINT"
    exit 1
fi

echo -e "${GREEN}✓ Code ID obtido: $CODE_ID${NC}"
echo ""

echo -e "${BLUE}Passo 4: Instanciando o contrato...${NC}"

# Mensagem de inicialização (linha ~140)
MSG="{}"
echo -e "${YELLOW}Mensagem de inicialização: $MSG${NC}"

# Instanciar o contrato
INSTANTIATE_RES=$(xiond tx wasm instantiate $CODE_ID "$MSG" \
  --from $WALLET \
  --label "cw-counter-$(date +%s)" \
  --gas-prices ${GAS_PRICE}${GAS_DENOM} \
  --gas auto \
  --gas-adjustment 1.3 \
  -y --no-admin \
  --chain-id $CHAIN_ID \
  --node $RPC_ENDPOINT \
  --output json)

echo -e "${YELLOW}Resposta da instanciação:${NC}"
echo $INSTANTIATE_RES | jq .

# Extrair o transaction hash da instanciação
INSTANTIATE_TXHASH=$(echo $INSTANTIATE_RES | jq -r '.txhash')

if [ "$INSTANTIATE_TXHASH" = "null" ] || [ -z "$INSTANTIATE_TXHASH" ]; then
    echo -e "${RED}Erro: Não foi possível obter o transaction hash da instanciação${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Contrato instanciado com sucesso${NC}"
echo -e "${YELLOW}Transaction Hash da instanciação: $INSTANTIATE_TXHASH${NC}"
echo ""

echo -e "${BLUE}Aguardando confirmação da instanciação...${NC}"
sleep 15  # Aumentado para 15 segundos

echo -e "${BLUE}Passo 5: Obtendo o endereço do contrato...${NC}"

# Obter o endereço do contrato com retry
retry_count=0
max_retries=5
while [ $retry_count -lt $max_retries ]; do
    CONTRACT=$(xiond query tx $INSTANTIATE_TXHASH \
      --node $RPC_ENDPOINT \
      --output json 2>/dev/null | jq -r '.events[] | select(.type == "instantiate") | .attributes[] | select(.key == "_contract_address") | .value' 2>/dev/null)
    
    if [ "$CONTRACT" != "null" ] && [ -n "$CONTRACT" ]; then
        break
    fi
    
    retry_count=$((retry_count + 1))
    echo -e "${YELLOW}Tentativa $retry_count/$max_retries - Aguardando confirmação...${NC}"
    sleep 10
done

if [ "$CONTRACT" = "null" ] || [ -z "$CONTRACT" ]; then
    echo -e "${RED}Erro: Não foi possível obter o endereço do contrato após $max_retries tentativas${NC}"
    echo "Verifique se a transação foi confirmada: xiond query tx $INSTANTIATE_TXHASH --node $RPC_ENDPOINT"
    exit 1
fi

echo -e "${GREEN}✓ Endereço do contrato obtido: $CONTRACT${NC}"
echo ""

# Verificar se o contrato foi instanciado corretamente (linha ~200)
echo -e "${BLUE}Verificando se o contrato foi instanciado corretamente...${NC}"
TOTAL_RESULT=$(xiond query wasm contract-state smart $CONTRACT '{"get_total": {}}' --node $RPC_ENDPOINT --output json 2>/dev/null | jq -r '.data.total' 2>/dev/null)
if [ "$TOTAL_RESULT" = "0" ]; then
    echo -e "${GREEN}✓ Contrato verificado - Total inicial: $TOTAL_RESULT${NC}"
else
    echo -e "${YELLOW}⚠ Aviso: Não foi possível verificar o estado inicial do contrato${NC}"
fi
echo ""

echo -e "${GREEN}=== DEPLOY CONCLUÍDO COM SUCESSO ===${NC}"
echo -e "${BLUE}Resumo:${NC}"
echo -e "  Network: ${YELLOW}XION Testnet (${CHAIN_ID})${NC}"
echo -e "  Wallet: ${YELLOW}$WALLET${NC}"
echo -e "  Code ID: ${YELLOW}$CODE_ID${NC}"
echo -e "  Endereço do Contrato: ${YELLOW}$CONTRACT${NC}"
echo ""
echo -e "${BLUE}Para interagir com o contrato, use:${NC}"
echo -e "${YELLOW}# Consultar total de pontos:${NC}"
echo "xiond query wasm contract-state smart $CONTRACT '{\"get_total\": {}}' --node $RPC_ENDPOINT"
echo ""
echo -e "${YELLOW}# Consultar ranking:${NC}"
echo "xiond query wasm contract-state smart $CONTRACT '{\"get_rank\": {}}' --node $RPC_ENDPOINT"
echo ""
echo -e "${YELLOW}# Registrar novo jogo:${NC}"
echo "xiond tx wasm execute $CONTRACT '{\"new_game\": {\"player\": \"xion1...\", \"score\": 100, \"game_time\": 60}}' --from $WALLET --chain-id $CHAIN_ID --gas-prices ${GAS_PRICE}${GAS_DENOM} --gas auto --gas-adjustment 1.3 -y --node $RPC_ENDPOINT"
echo ""
echo -e "${YELLOW}# Incrementar contador:${NC}"
echo "xiond tx wasm execute $CONTRACT '{\"increment_counter\": {}}' --from $WALLET --chain-id $CHAIN_ID --gas-prices ${GAS_PRICE}${GAS_DENOM} --gas auto --gas-adjustment 1.3 -y --node $RPC_ENDPOINT"
echo ""
echo -e "${YELLOW}# Resetar contador:${NC}"
echo "xiond tx wasm execute $CONTRACT '{\"reset_counter\": {\"count\": 0}}' --from $WALLET --chain-id $CHAIN_ID --gas-prices ${GAS_PRICE}${GAS_DENOM} --gas auto --gas-adjustment 1.3 -y --node $RPC_ENDPOINT"

# Salvar informações em arquivo
echo "NETWORK=$CHAIN_ID" > .env.deploy
echo "RPC_ENDPOINT=$RPC_ENDPOINT" >> .env.deploy
echo "WALLET=$WALLET" >> .env.deploy
echo "CODE_ID=$CODE_ID" >> .env.deploy
echo "CONTRACT_ADDRESS=$CONTRACT" >> .env.deploy
echo "DEPLOY_DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> .env.deploy

echo ""
echo -e "${GREEN}✓ Informações salvas em .env.deploy${NC}"
echo -e "${BLUE}Arquivo .env.deploy criado com todas as informações do deploy${NC}"