use cosmwasm_std::{Addr, DepsMut, Response};

use crate::error::ContractError;
use crate::state::model::Game;
use crate::state::storage::{GAMES, RANK, TOTAL};

pub fn new_game(
    deps: DepsMut,
    player: Addr,
    score: u64,
    game_time: u64,
) -> Result<Response, ContractError> {
    // UPDATE TOTAL GAMES

    let total = TOTAL.load(deps.storage)?;
    TOTAL.save(deps.storage, &(total + 1))?;

    // UPDATE RANK
    let mut rank = RANK.load(deps.storage)?;
    rank.push((score, player.clone()));
    rank.sort_by(|a, b| b.0.cmp(&a.0));
    RANK.save(deps.storage, &rank)?;

    // SAVE GAME

    GAMES.save(deps.storage, player.clone(), &Game { score, game_time })?;

    Ok(Response::new()
        .add_attribute("action", "new_game")
        .add_attribute("player", player.to_string())
        .add_attribute("score", score.to_string())
        .add_attribute("game_time", game_time.to_string()))
}
