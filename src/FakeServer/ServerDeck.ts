import { suits, values } from "../Card";


export class Deck {
    cardIds: string[];

    constructor() {
        this.cardIds = [];
        this.createDeck();
    }

    private createDeck() {
        for (let suit in suits) {
            if (isNaN(Number(suit))) {
                for (let value in values) {
                    if (isNaN(Number(value))) {
                        const card_suit = suits[suit as keyof typeof suits]
                        const card_value = values[value as keyof typeof values]
                        const card_id = card_value + "__" + card_suit
    
                        this.cardIds.push(card_id);
                    }
                }
            }
        }
    }

    public shuffle() {
        for (let i = this.cardIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cardIds[i], this.cardIds[j]] = [this.cardIds[j], this.cardIds[i]];
        }
    }

    public drawCard() {
        return this.cardIds.pop();
    }

}
