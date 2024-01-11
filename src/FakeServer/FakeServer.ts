import { Deck } from "./ServerDeck"
import { EventManager, GameEventTypes, HumanPlayedCardInfo, NewDeckInfo, GameStateEventInfo } from "../EventManager"
import { Team } from "../Team"

export class FakeServer{
    team1 = new Team("team1")
    team2 = new Team("team2")
    playerIds = [this.team1.player1, this.team2.player1, this.team1.player2, this.team2.player2]
    playerId=0
    activePlayerid=0
    deck = new Deck()
    round = 0
    dealerId = -1
    score = 0
    gameId=0
    //we should have games. Only one to make it easy

    constructor() {
        EventManager.subscribeTo(GameEventTypes.newGameRequired, this.onReady.bind(this))
        EventManager.subscribeTo(GameEventTypes.humanPlayerPlayedCard, this.onHumanPlayerPlayed.bind(this))
    }

    onNewGame() {
        console.log("SERVER- onNewGame")
        this.round = 0
        this.newRound()
    }

    newRound() {
        console.log("SERVER- newRound")
        this.round++
        this.dealCards()
        this.playerId = (this.dealerId + 1) % 4
        this.activePlayerid = this.playerId
        this.notify(GameEventTypes.server_newRound)
    }

    dealCards() {
        console.log("SERVER- dealCards")
        this.deck.shuffle()
        for (let i = 0; i < 4; i++) {
            const playerId = (this.dealerId + 1 + i) % 4
            const player = this.playerIds[playerId]
            const cards = this.deck.cardIds.slice(8 * i, 8 * (i + 1))
            player.setHandIds(cards)
        }
    }

    getHands(): Array<Array<string>> {
        const hands = []
        for (let i = 0; i < 4; i++) {
            const player = this.playerIds[i]
            const cardIds = player.hand_with_ids
            hands.push(cardIds)
        }
        return hands
    }

    getGameInfo(): GameStateEventInfo {
        const info: GameStateEventInfo = {
            gameId: this.gameId,
            playerId: this.playerId,
            newActivePlayerId: this.activePlayerid,
            score: this.score,
            round: this.round,
            hands: this.getHands()
        }
        return info
    }

    notify(evenType: GameEventTypes, info: (GameStateEventInfo | null) = null) {
        EventManager.notifySite(evenType, info || this.getGameInfo() )
    }

    onReady(event: GameEventTypes.newGameRequired) {
        console.log("onReady")
        this.onNewGame()
        this.notify(GameEventTypes.server_aknowledged)
    }

    onHumanPlayerPlayed(event: GameEventTypes.humanPlayerPlayedCard, info: HumanPlayedCardInfo) {
        const playerId = info.playerId
        const playedCardId = info.cardId
        const player = this.playerIds[playerId]
        player.playCard(playedCardId)
        this.notify(GameEventTypes.server_aknowledged)
    }

}