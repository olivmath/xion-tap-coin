# ARCH

```bash
cw-counter/
├── src/
│   ├── contract.rs    # Lógica principal (como seu contrato Solidity)
│   ├── state.rs       # Storage/Estado (como suas variáveis de estado)
│   ├── msg.rs         # Mensagens/Interface (como suas funções públicas)
│   ├── error.rs       # Erros customizados
│   ├── helpers.rs     # Utilitários
│   └── lib.rs         # Entry point
└── Cargo.toml         # Dependências
```

# STORAGE

## XION

```rust
// src/state.rs
use cosmwasm_std::Addr;
use cw_storage_plus::Item;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct State {
    pub count: i32,
    pub owner: Addr,
}

pub const STATE: Item<State> = Item::new("state");
```

## SOLIDITY

```solidity
struct State {
    int32 count;
    address owner;
}

// Storage state - equivalente ao Item<State> do CosmWasm
State public state;
```


## ETAPAS:

1. deploy do contrato
2. criar o tesouro para o contrato