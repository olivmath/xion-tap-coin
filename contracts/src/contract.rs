#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;

// Correção: adicionar prefixos corretos nos imports
use crate::error::ContractError;
use crate::handlers::execute;
use crate::handlers::query;
use crate::msg::execute::ExecuteMsg;
use crate::msg::instantiate::InstantiateMsg;
use crate::msg::query::QueryMsg;
use crate::state::model::Game;
use crate::state::storage::GAMES;

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:increment";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    use crate::state::storage::{RANK, TOTAL};

    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    // Inicializar o estado
    TOTAL.save(deps.storage, &0u64)?;
    RANK.save(deps.storage, &Vec::new())?;
    GAMES.save(
        deps.storage,
        info.sender.clone(),
        &Game {
            score: 0,
            game_time: 0,
        },
    )?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::NewGame {
            player,
            score,
            game_time,
        } => execute::new_game(deps, player, score, game_time),
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetTotal {} => to_json_binary(&query::get_total(deps)?),
        QueryMsg::GetRank {} => to_json_binary(&query::get_rank(deps)?),
        QueryMsg::GetScoreByPlayer { player } => {
            to_json_binary(&query::get_score_by_player(deps, player)?)
        }
    }
}
