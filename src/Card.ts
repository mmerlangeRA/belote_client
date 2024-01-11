import gsap from 'gsap';
import * as THREE from 'three';

export enum suits{
    clubs = "clubs",
    diamonds = "diamonds",
    hearts ="hearts",
    spades ="spades"
}

export enum values{
    _7 = "7",
    _8= "8",
    _9 = "9",
    _10 = "10",
    _J = "jack",
    _Q = "queen",
    _K = "king",
    _A = "ace",
}

export interface card3DObject extends THREE.Mesh{
    originalZ: number;
    card: Card | null
}

export class Pot{
    pivot= new THREE.Object3D()
    playerSlots: Array<THREE.Vector3> = []
    cards: Array<Card> = []
    setSlots(scene: THREE.Scene, pivotPosition: THREE.Vector3, slots: Array<THREE.Vector3>) {
        scene.add(this.pivot)
        this.pivot.position.copy(pivotPosition)
        this.playerSlots = slots
    }
    addToPot(playerId: number, _card3DObject: card3DObject) {
        const slot = this.playerSlots[playerId]
        this.pivot.attach(_card3DObject)
        const dz = this.pivot.children.length * 0.002
        _card3DObject.originalZ = slot.z + dz
        const card = _card3DObject.card as Card
        card.isSelected = false
        card.isPlayed = true
        gsap.to(_card3DObject.position, { x: slot.x, y: slot.y, z: _card3DObject.originalZ, duration: 0.5, ease: "linear" })
    }
    
}

export class Card{
    suit: suits;
    value: values;
    imagePath: string
    style = "traditional"
    id: string
    object3D: card3DObject;
    parent: THREE.Object3D | null = null
    isSelected = false
    isPlayed = false
    static highlightedCards: Array<Card> = []
    static backTexture = new THREE.TextureLoader().load('./assets/sprites/cardbacks/cards_back2.png');
    static pot = new Pot()
    constructor(suit: suits, value: values) {
        this.suit = suit;
        this.value = value;
        this.id=this.value+"__"+this.suit
        this.imagePath = `./assets/sprites/traditional/cards_${this.style}_${this.suit}_${this.value}.png`
        this.object3D = this.create3DCard()
    }
    public getMe() {
        return {
            suit: this.suit,
            value: this.value,
            imagePath:this.imagePath
        }
    }
    static createFromId(id: string) {
        const splitted = id.split("__")
        return new Card(splitted[1] as suits, splitted[0] as values)
    }

    create3DCard(): card3DObject {
        const width = 0.0635
        const geometry = new THREE.PlaneGeometry(width, width * 2);
        const frontMaterial = new THREE.MeshStandardMaterial({
            depthWrite: true,
            depthTest: true,
            alphaTest: 0.5,
            transparent: true,
            alphaToCoverage: true,
            map: new THREE.TextureLoader().load(this.imagePath)
        });
        const backMaterial = new THREE.MeshStandardMaterial({
            depthWrite: true,
            depthTest: true,
            alphaTest: 0.5,
            transparent: true,
            alphaToCoverage: true,
            map: Card.backTexture
        });
        const frontPlane = new THREE.Mesh(geometry, frontMaterial) as unknown as card3DObject;
       
        // Back side of the card (rotated 180 degrees)
        const backPlane = new THREE.Mesh(geometry, backMaterial);
        

        // Group to hold both planes
        frontPlane.add(backPlane);
        backPlane.rotation.y = Math.PI;
        frontPlane.position.z = 0.001; // Slightly offset the front plane
        frontPlane.name = this.id
        frontPlane.card = this
        return frontPlane
    }

    highlight(): void{
        const highlightedDz = 0.02
        Card.highlightedCards.forEach(c => {
            
            if (c.isSelected) {
                gsap.to(c.object3D.position, { z: c.object3D.originalZ, duration: 0.2, ease: "linear" })
            }
            
            c.isSelected = false
        })
        this.isSelected = true
        gsap.to(this.object3D.position, { z: this.object3D.originalZ + highlightedDz, duration: 1, ease: "elastic" })
        Card.highlightedCards.push(this)
    }

}