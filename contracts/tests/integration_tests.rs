#[cfg(test)]
mod tests {
    use cosmwasm_std::{Addr, Coin, Empty, Uint128};
    use cw_counter::helpers::CwCounterContract;
    use cw_counter::msg::execute::ExecuteMsg;
    use cw_counter::msg::instantiate::InstantiateMsg;
    use cw_counter::msg::query::QueryMsg;
    use cw_counter::msg::response::{GetRankResponse, GetScoreByPlayerResponse, GetTotalResponse};
    use cw_multi_test::{App, AppBuilder, Contract, ContractWrapper, Executor};

    pub fn contract_template() -> Box<dyn Contract<Empty>> {
        let contract = ContractWrapper::new(
            cw_counter::contract::execute,
            cw_counter::contract::instantiate,
            cw_counter::contract::query,
        );
        Box::new(contract)
    }

    const USER1: &str = "alice";
    const USER2: &str = "bob";
    const USER3: &str = "charlie";
    const ADMIN: &str = "admin";
    const NATIVE_DENOM: &str = "denom";

    fn mock_app() -> App {
        AppBuilder::new().build(|router, _, storage| {
            for user in [USER1, USER2, USER3, ADMIN] {
                router
                    .bank
                    .init_balance(
                        storage,
                        &Addr::unchecked(user),
                        vec![Coin {
                            denom: NATIVE_DENOM.to_string(),
                            amount: Uint128::new(1000),
                        }],
                    )
                    .unwrap();
            }
        })
    }

    fn proper_instantiate() -> (App, CwCounterContract) {
        let mut app = mock_app();
        let contract_id = app.store_code(contract_template());

        let msg = InstantiateMsg {};
        let contract_addr = app
            .instantiate_contract(
                contract_id,
                Addr::unchecked(ADMIN),
                &msg,
                &[],
                "cw-counter",
                None,
            )
            .unwrap();

        let contract = CwCounterContract(contract_addr);
        (app, contract)
    }

    #[test]
    fn test_multiple_players_integration() {
        let (mut app, contract) = proper_instantiate();

        // Alice joga
        let msg = ExecuteMsg::NewGame {
            player: Addr::unchecked(USER1),
            score: 150,
            game_time: 60,
        };
        let cosmos_msg = contract.call(msg).unwrap();
        app.execute(Addr::unchecked(USER1), cosmos_msg).unwrap();

        // Bob joga
        let msg = ExecuteMsg::NewGame {
            player: Addr::unchecked(USER2),
            score: 200,
            game_time: 45,
        };
        let cosmos_msg = contract.call(msg).unwrap();
        app.execute(Addr::unchecked(USER2), cosmos_msg).unwrap();

        // Charlie joga
        let msg = ExecuteMsg::NewGame {
            player: Addr::unchecked(USER3),
            score: 100,
            game_time: 75,
        };
        let cosmos_msg = contract.call(msg).unwrap();
        app.execute(Addr::unchecked(USER3), cosmos_msg).unwrap();

        // Verificar total de jogos
        let total: GetTotalResponse = app
            .wrap()
            .query_wasm_smart(contract.addr(), &QueryMsg::GetTotal {})
            .unwrap();
        assert_eq!(3, total.total);

        // Verificar scores individuais
        let alice_score: GetScoreByPlayerResponse = app
            .wrap()
            .query_wasm_smart(
                contract.addr(),
                &QueryMsg::GetScoreByPlayer {
                    player: Addr::unchecked(USER1),
                },
            )
            .unwrap();
        assert_eq!(150, alice_score.score);

        let bob_score: GetScoreByPlayerResponse = app
            .wrap()
            .query_wasm_smart(
                contract.addr(),
                &QueryMsg::GetScoreByPlayer {
                    player: Addr::unchecked(USER2),
                },
            )
            .unwrap();
        assert_eq!(200, bob_score.score);

        // Verificar ranking
        let rank: GetRankResponse = app
            .wrap()
            .query_wasm_smart(contract.addr(), &QueryMsg::GetRank {})
            .unwrap();

        assert_eq!(3, rank.rank.len());
        // Verificar ordem: Bob (200), Alice (150), Charlie (100)
        assert_eq!((200, Addr::unchecked(USER2)), rank.rank[0]);
        assert_eq!((150, Addr::unchecked(USER1)), rank.rank[1]);
        assert_eq!((100, Addr::unchecked(USER3)), rank.rank[2]);
    }

    #[test]
    fn test_player_improvement() {
        let (mut app, contract) = proper_instantiate();

        // Alice joga primeira vez
        let msg = ExecuteMsg::NewGame {
            player: Addr::unchecked(USER1),
            score: 100,
            game_time: 60,
        };
        let cosmos_msg = contract.call(msg).unwrap();
        app.execute(Addr::unchecked(USER1), cosmos_msg).unwrap();

        // Alice melhora seu score
        let msg = ExecuteMsg::NewGame {
            player: Addr::unchecked(USER1),
            score: 250,
            game_time: 45,
        };
        let cosmos_msg = contract.call(msg).unwrap();
        app.execute(Addr::unchecked(USER1), cosmos_msg).unwrap();

        // Verificar que o score atual é o melhor
        let alice_score: GetScoreByPlayerResponse = app
            .wrap()
            .query_wasm_smart(
                contract.addr(),
                &QueryMsg::GetScoreByPlayer {
                    player: Addr::unchecked(USER1),
                },
            )
            .unwrap();
        assert_eq!(250, alice_score.score);

        // Verificar que ambos os jogos estão no ranking
        let rank: GetRankResponse = app
            .wrap()
            .query_wasm_smart(contract.addr(), &QueryMsg::GetRank {})
            .unwrap();

        assert_eq!(2, rank.rank.len());
        assert_eq!((250, Addr::unchecked(USER1)), rank.rank[0]);
        assert_eq!((100, Addr::unchecked(USER1)), rank.rank[1]);

        // Verificar total de jogos
        let total: GetTotalResponse = app
            .wrap()
            .query_wasm_smart(contract.addr(), &QueryMsg::GetTotal {})
            .unwrap();
        assert_eq!(2, total.total);
    }

    #[test]
    fn test_competitive_scenario() {
        let (mut app, contract) = proper_instantiate();

        // Simular uma competição com múltiplas rodadas
        let games = vec![
            (USER1, 180, 50),
            (USER2, 220, 40),
            (USER3, 160, 65),
            (USER1, 240, 35), // Alice melhora
            (USER2, 200, 45), // Bob piora
            (USER3, 280, 30), // Charlie tem um jogo excelente
        ];

        for (player, score, game_time) in games {
            let msg = ExecuteMsg::NewGame {
                player: Addr::unchecked(player),
                score,
                game_time,
            };
            let cosmos_msg = contract.call(msg).unwrap();
            app.execute(Addr::unchecked(player), cosmos_msg).unwrap();
        }

        // Verificar ranking final
        let rank: GetRankResponse = app
            .wrap()
            .query_wasm_smart(contract.addr(), &QueryMsg::GetRank {})
            .unwrap();

        assert_eq!(6, rank.rank.len());

        // Verificar que Charlie tem o melhor score (280)
        assert_eq!((280, Addr::unchecked(USER3)), rank.rank[0]);

        // Verificar scores atuais dos jogadores (último jogo de cada um)
        let charlie_score: GetScoreByPlayerResponse = app
            .wrap()
            .query_wasm_smart(
                contract.addr(),
                &QueryMsg::GetScoreByPlayer {
                    player: Addr::unchecked(USER3),
                },
            )
            .unwrap();
        assert_eq!(280, charlie_score.score);

        let alice_score: GetScoreByPlayerResponse = app
            .wrap()
            .query_wasm_smart(
                contract.addr(),
                &QueryMsg::GetScoreByPlayer {
                    player: Addr::unchecked(USER1),
                },
            )
            .unwrap();
        assert_eq!(240, alice_score.score);

        let bob_score: GetScoreByPlayerResponse = app
            .wrap()
            .query_wasm_smart(
                contract.addr(),
                &QueryMsg::GetScoreByPlayer {
                    player: Addr::unchecked(USER2),
                },
            )
            .unwrap();
        assert_eq!(200, bob_score.score);

        // Verificar total de jogos
        let total: GetTotalResponse = app
            .wrap()
            .query_wasm_smart(contract.addr(), &QueryMsg::GetTotal {})
            .unwrap();
        assert_eq!(6, total.total);
    }
}
