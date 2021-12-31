# cdp
cdp development
# to do list
server-client
game start, login(only username), credential:cookie, avatar
optional:upload rule document(players, game rules, cards)
play cards, card status define(up and down), card owned by someone, status transfer
json data:{card id, card type, data:{}}

status:{}
card:

deadline: 2021/12/31
游戏：拖板车
methods: 
return player set, player/observer, url: /, input: None, output: player view, number of player
start game/end game, url: /api/start_game, input: post request from both players, output: game view, card views
play a card, input: None, output: changed view of game
auto end game, input: None, output: changed view of game
