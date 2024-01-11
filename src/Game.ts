import { Card } from "./Card";
import { Deck } from "./FakeServer/ServerDeck";
import { EventManager, GameEventTypes, NewDeckInfo, GameStateEventInfo, GameStateChangedEventTypes } from "./EventManager";
import { Player } from "./Player";
import { Team } from "./Team";

export class SiteGameState{
    team1 = new Team("team1")
    team2 = new Team("team2")
    playerIds = [this.team1.player1, this.team2.player1, this.team1.player2, this.team2.player2]
    round = 0
    dealerId = -1
    dealer: Player | undefined 
    activePlayer: Player | undefined 
    score= 0
    

    constructor() {
        this.team1.player1.id = 0
        this.team1.player2.id = 2
        this.team2.player1.id = 1
        this.team2.player2.id = 3
        EventManager.subscribeTo(GameEventTypes.server_newRound, this.onNewRound.bind(this))
        
    }

    public onNewRound(evenType: GameEventTypes, info: GameStateEventInfo) {
        console.log("onNewRound")
        this.round = info.round
        this.score = info.score
        this.dealerId = info.playerId
        this.dealer = this.playerIds[this.dealerId]
        this.activePlayer = this.playerIds[info.newActivePlayerId]
        const hands = info.hands
        for (let i = 0; i < 4; i++){
            this.playerIds[i].setHand(hands[i])
        }
        EventManager.notifyUI(GameStateChangedEventTypes.newRound, info)
    }

    public startGame() {
        EventManager.notifyServer(GameEventTypes.newGameRequired)
    }
}