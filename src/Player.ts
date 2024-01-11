import { Card, card3DObject } from "./Card"
import * as THREE from 'three';

export class Player{
    name: string = ""
    hand: Array<Card> = []
    isHuman = false
    id = 0
    handPosition = new THREE.Object3D()
    potPosition = new THREE.Object3D()
    avatar: HTMLImageElement = new Image()
    hand_with_ids: string[]=[];
    
    constructor(name: string) {
        this.setName(name)
    }
    public setName(name: string) {
        this.name = name
    }

    public setHand(hand_with_ids: Array<string>) { 
        const hand = hand_with_ids.map(id=>Card.createFromId(id))
        this.hand = hand
        this.handPosition.children.forEach(child => {
            this.handPosition.remove(child)
        })
        const dz = 0.001
        const dx = 0.02
        const dy = -0.001
        let ci = 0;

        this.hand.forEach(card => {
            const card3D = card.object3D
            this.handPosition.add(card3D)
            card3D.position.set(dx * (ci - 4), dy * (ci - 4), dz * ci)
            card3D.originalZ = card3D.position.z
            ci++
        })
    }

    public setHandIds(hand_with_ids: Array<string>) {
        this.hand_with_ids = hand_with_ids
    }

    public playCard(cardId: string) {
        const card = this.hand.find(card => card.id === cardId);
        if (!card) {
            throw new Error('Card not found');
        }
        const index = this.hand.indexOf(card);
        this.hand.splice(index, 1);
        const card3D = this.handPosition.children.find(c => c.name == cardId)
        if (!card3D) {
            throw new Error('Card not found');
        }
        Card.pot.addToPot(this.id, card3D as card3DObject)
       
    }

    public getHand() {
        return this.hand
    }

    public get3DCards(): Array<THREE.Object3D>{
        return this.hand.map(h=>h.object3D)
    }

    showHand() {

    }

    setActive() {
        this.avatar.classList.add("activePlayer")
    }

    setInactive() { 
        this.avatar.classList.remove("activePlayer")
    }

    setAvatar() {
        this.avatar = document.createElement("img") as HTMLImageElement
        this.avatar.src = "./assets/avatars/img_avatar" + (this.id % 2 + 1) + ".png"
        this.avatar.classList.add("avatar")
        this.avatar.classList.add("player" + (this.id + 1))
        this.avatar.classList.add("team" + (this.id%2 + 1))

    }
}