#[cfg(test)]
mod tests {
    use cw_counter::contract::{execute, instantiate, query};
    use cw_counter::msg::execute::ExecuteMsg;
    use cw_counter::msg::instantiate::InstantiateMsg;
    use cw_counter::msg::query::QueryMsg;
    use cw_counter::msg::response::{GetRankResponse, GetScoreByPlayerResponse, GetTotalResponse};

    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, from_json, Addr};

    #[test]
    fn proper_initialization() {
        let mut deps = mock_dependencies();

        let msg = InstantiateMsg {};
        let info = mock_info("creator", &coins(1000, "earth"));

        // Inicialização deve ser bem-sucedida
        let res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
        assert_eq!(0, res.messages.len());

        // Verificar estado inicial - total deve ser 0
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetTotal {}).unwrap();
        let value: GetTotalResponse = from_json(&res).unwrap();
        assert_eq!(0, value.total);

        // Verificar rank inicial - deve estar vazio
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetRank {}).unwrap();
        let value: GetRankResponse = from_json(&res).unwrap();
        assert_eq!(0, value.rank.len());
    }

    #[test]
    fn single_player_game() {
        let mut deps = mock_dependencies();

        let msg = InstantiateMsg {};
        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();

        // Jogador faz um jogo
        let player = Addr::unchecked("player1");
        let info = mock_info("anyone", &coins(2, "token"));
        let msg = ExecuteMsg::NewGame {
            player: player.clone(),
            score: 100,
            game_time: 60,
        };
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

        // Verificar score do jogador
        let res = query(
            deps.as_ref(),
            mock_env(),
            QueryMsg::GetScoreByPlayer {
                player: player.clone(),
            },
        )
        .unwrap();
        let value: GetScoreByPlayerResponse = from_json(&res).unwrap();
        assert_eq!(100, value.score);

        // Verificar total de jogos
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetTotal {}).unwrap();
        let value: GetTotalResponse = from_json(&res).unwrap();
        assert_eq!(1, value.total);

        // Verificar rank
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetRank {}).unwrap();
        let value: GetRankResponse = from_json(&res).unwrap();
        assert_eq!(1, value.rank.len());
        assert_eq!((100, player), value.rank[0]);
    }

    #[test]
    fn multiple_players_games() {
        let mut deps = mock_dependencies();

        let msg = InstantiateMsg {};
        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();

        // Múltiplos jogadores fazem jogos
        let players = vec![
            (Addr::unchecked("alice"), 150, 45),
            (Addr::unchecked("bob"), 200, 30),
            (Addr::unchecked("charlie"), 75, 90),
            (Addr::unchecked("diana"), 300, 25),
        ];

        for (player, score, game_time) in &players {
            let info = mock_info("anyone", &coins(2, "token"));
            let msg = ExecuteMsg::NewGame {
                player: player.clone(),
                score: *score,
                game_time: *game_time,
            };
            let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();
        }

        // Verificar total de jogos
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetTotal {}).unwrap();
        let value: GetTotalResponse = from_json(&res).unwrap();
        assert_eq!(4, value.total);

        // Verificar scores individuais
        for (player, expected_score, _) in &players {
            let res = query(
                deps.as_ref(),
                mock_env(),
                QueryMsg::GetScoreByPlayer {
                    player: player.clone(),
                },
            )
            .unwrap();
            let value: GetScoreByPlayerResponse = from_json(&res).unwrap();
            assert_eq!(*expected_score, value.score);
        }

        // Verificar ranking (deve estar ordenado por score decrescente)
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetRank {}).unwrap();
        let value: GetRankResponse = from_json(&res).unwrap();
        assert_eq!(4, value.rank.len());

        // Verificar ordem do ranking: Diana (300), Bob (200), Alice (150), Charlie (75)
        assert_eq!((300, Addr::unchecked("diana")), value.rank[0]);
        assert_eq!((200, Addr::unchecked("bob")), value.rank[1]);
        assert_eq!((150, Addr::unchecked("alice")), value.rank[2]);
        assert_eq!((75, Addr::unchecked("charlie")), value.rank[3]);
    }

    #[test]
    fn player_updates_score() {
        let mut deps = mock_dependencies();

        let msg = InstantiateMsg {};
        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();

        let player = Addr::unchecked("player1");

        // Primeiro jogo
        let info = mock_info("anyone", &coins(2, "token"));
        let msg = ExecuteMsg::NewGame {
            player: player.clone(),
            score: 100,
            game_time: 60,
        };
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

        // Segundo jogo com score melhor
        let info = mock_info("anyone", &coins(2, "token"));
        let msg = ExecuteMsg::NewGame {
            player: player.clone(),
            score: 250,
            game_time: 45,
        };
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

        // Verificar que o score foi atualizado
        let res = query(
            deps.as_ref(),
            mock_env(),
            QueryMsg::GetScoreByPlayer {
                player: player.clone(),
            },
        )
        .unwrap();
        let value: GetScoreByPlayerResponse = from_json(&res).unwrap();
        assert_eq!(250, value.score);

        // Verificar que o total de jogos aumentou
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetTotal {}).unwrap();
        let value: GetTotalResponse = from_json(&res).unwrap();
        assert_eq!(2, value.total);

        // Verificar ranking atualizado
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetRank {}).unwrap();
        let value: GetRankResponse = from_json(&res).unwrap();
        assert_eq!(2, value.rank.len());
        assert_eq!((250, player.clone()), value.rank[0]);
        assert_eq!((100, player), value.rank[1]);
    }

    #[test]
    fn query_nonexistent_player() {
        let mut deps = mock_dependencies();

        let msg = InstantiateMsg {};
        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();

        // Tentar consultar jogador que não existe
        let res = query(
            deps.as_ref(),
            mock_env(),
            QueryMsg::GetScoreByPlayer {
                player: Addr::unchecked("nonexistent"),
            },
        );

        // Deve retornar erro
        assert!(res.is_err());
    }
}
