import { Card, suits } from "./Card";

export interface BidInfo{
    suit: suits,
    bid: number,
}

export interface GameStateEventInfo{
    gameId:number,
    playerId: number,
    newActivePlayerId: number,
    hands: Array<Array<string>>,
    score: number,
    round:number
}

export interface SiteGameEventInfo {
    playerId: number,
}

export interface HumanPlayedCardInfo extends SiteGameEventInfo {
    cardId: string,
}

export interface HumanBiddedInfo extends SiteGameEventInfo {
    bid: BidInfo,
}


export interface NewDeckInfo extends GameStateEventInfo {
    
}

export interface TeamWonInfo extends GameStateEventInfo {
    winningTeam: number
}

export enum GameEventTypes{
    newGameRequired ="newGameRequired",
    server_aknowledged ="server_aknowledged",
    server_newRound ="server_newRound",
    server_newDeck ="server_newDeck",
    humanPlayerBidded ="humanPlayerBidded",
    humanPlayerPlayedCard ="humanPlayerPlayedCard",
    ailayerBidded ="ailayerBidded",
    aiPlayerPlayedCard ="aiPlayerPlayedCard",
    server_teamWon ="server_teamWon",
    gameState_newRound ="gameState_newRound",
}

export enum GameStateChangedEventTypes {
    newRound ="newRound",
}

export class EventManager {
    private static subscribers = new Map<GameEventTypes | GameStateChangedEventTypes, Function[]>();

    public static subscribeTo(eventType: GameEventTypes | GameStateChangedEventTypes , callback: Function): void {
            if (!EventManager.subscribers.has(eventType)) {
                EventManager.subscribers.set(eventType, [])
            }
            EventManager.subscribers.get(eventType).push(callback)
    }

    public static unsubscribeTo(eventType: GameEventTypes, callback: Function): void {
            let callBacks = EventManager.subscribers.get(eventType) as Array<any>
            callBacks = callBacks.filter(c => c != callback)
            EventManager.subscribers.set(eventType, callBacks)
    }

    public static notifyServer(eventType: GameEventTypes, details: (SiteGameEventInfo | null) = null): void {
        if (this.subscribers.has(eventType)) {
            this.subscribers.get(eventType).forEach(c => {
                c(eventType,details)
            })
        }
    }

    public static notifySite(eventType: GameEventTypes, details: GameStateEventInfo): void {
        if (this.subscribers.has(eventType)) {
            this.subscribers.get(eventType).forEach(c => {
                c(eventType,details)
            })
        }
    }

    public static notifyUI(eventType: GameStateChangedEventTypes, details: (GameStateEventInfo | null) = null): void {
        if (this.subscribers.has(eventType)) {
            this.subscribers.get(eventType).forEach(c => {
                c(eventType,details)
            })
        }
    }

    public static throwError(errorCode: number) {
        console.warn("Error: " + errorCode)
        var event = new CustomEvent('argo_error', { 'detail': errorCode });
        window.dispatchEvent(event);
    }
}