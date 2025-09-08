use crate::msg::response::{GetRankResponse, GetScoreByPlayerResponse, GetTotalResponse};
use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::Addr;

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(GetRankResponse)]
    GetRank {},

    #[returns(GetScoreByPlayerResponse)]
    GetScoreByPlayer { player: Addr },

    #[returns(GetTotalResponse)]
    GetTotal {},
}
