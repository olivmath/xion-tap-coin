use crate::msg::response::{GetRankResponse, GetScoreByPlayerResponse, GetTotalResponse};
use crate::state::storage::{GAMES, RANK, TOTAL};
use cosmwasm_std::{Addr, Deps, StdResult};

pub fn get_rank(deps: Deps) -> StdResult<GetRankResponse> {
    let rank = RANK.load(deps.storage)?;

    Ok(GetRankResponse { rank })
}

pub fn get_score_by_player(deps: Deps, player: Addr) -> StdResult<GetScoreByPlayerResponse> {
    let game = GAMES.load(deps.storage, player)?;

    Ok(GetScoreByPlayerResponse { score: game.score })
}

pub fn get_total(deps: Deps) -> StdResult<GetTotalResponse> {
    let total = TOTAL.load(deps.storage)?;
    Ok(GetTotalResponse { total })
}
