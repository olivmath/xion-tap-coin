use cosmwasm_schema::cw_serde;
use cosmwasm_std::Addr;

// We define a custom struct for each query response
#[cw_serde]
pub struct GetRankResponse {
    pub rank: Vec<(u64, Addr)>,
}

#[cw_serde]
pub struct GetScoreByPlayerResponse {
    pub score: u64,
}

#[cw_serde]
pub struct GetTotalResponse {
    pub total: u64,
}
