use cosmwasm_schema::cw_serde;
use cosmwasm_std::Addr;

#[cw_serde]
pub enum ExecuteMsg {
    NewGame {
        player: Addr,
        score: u64,
        game_time: u64,
    },
}
