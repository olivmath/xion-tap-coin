use super::model::Game;
use cosmwasm_std::Addr;
use cw_storage_plus::{Item, Map};

pub const GAMES: Map<Addr, Game> = Map::new("games");
pub const RANK: Item<Vec<(u64, Addr)>> = Item::new("rank");
pub const TOTAL: Item<u64> = Item::new("total");
