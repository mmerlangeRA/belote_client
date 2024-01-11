import * as THREE from 'three';
import { SiteGameState } from './Game';
import { Card, card3DObject } from './Card';
import { EventManager, GameEventTypes, GameStateChangedEventTypes, GameStateEventInfo, NewDeckInfo } from './EventManager';
import { MouseManager } from './MouseManager';
import { Player } from './Player';
import { LightManager } from './LightManager';

interface PlayerSettings{
    position: THREE.Vector3
    cardVisible: boolean
}

export class SceneManager{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    backgroundImage = './assets/sprites/backgrounds/table_background.png'

    scenePlayerPivots : Array<THREE.Object3D> = []

    mouseManager = new MouseManager()
    container: HTMLElement
    canvas: HTMLCanvasElement
    players: Player[];
    activePlayer:Player = new Player("")
    startButton = document.getElementById("startGame") as HTMLButtonElement

    constructor(container: HTMLElement, players:Array<Player>) {
        this.container = container
        console.log(players)
        this.players = players
        // Scene
        this.scene = new THREE.Scene();
        console.log(this.backgroundImage)
        this.scene.background = new THREE.TextureLoader().load(this.backgroundImage);

        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.camera.position.z = 0.5;


        this.canvas = document.createElement("canvas") as HTMLCanvasElement
        this.container.appendChild(this.canvas)
        this.canvas.style.width = "100%"
        this.canvas.style.height = "100%"
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias:true });
        this.onResize()
        const resize_ob = new ResizeObserver( (entries)=> {
            this.onResize()
        });

        // start observing for resize
        resize_ob.observe(this.container);


        (new LightManager(this.scene, this.renderer)).setLights()
        //@ts-ignore
        window.scene = this.scene
        //this.scene.add(this.cube);


        this.setPlayers()
        EventManager.subscribeTo(GameStateChangedEventTypes.newRound, this.startRound.bind(this))
        //window.addEventListener('mouseover', this.onMouseOver.bind(this));
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.animate()
        this.startButton.addEventListener("click", () => {
            this.startButton.style.display = "none"
            EventManager.notifyServer(GameEventTypes.newGameRequired)  
        })
    }

    onMouseOver(event: MouseEvent) {
        const object3D = this.mouseManager.onMouseOver(event, this.camera, this.activePlayer.get3DCards())
        if (object3D && object3D.card) {
            object3D.card.highlight()
        }
    }

    onMouseDown(event: MouseEvent) {
        const object3D = this.mouseManager.onMouseOver(event, this.camera, this.activePlayer.get3DCards()) as card3DObject
        if (object3D && object3D.card) {
            if (object3D.card.isSelected) {
                this.activePlayer.playCard(object3D.card.id)
                this.setActivePlayer((this.activePlayer.id+1)%4)
            } else {
                object3D.card.highlight()
            }
            
        }
    }




    addGameObject(obj: THREE.Object3D) { }

    animate():void {
        requestAnimationFrame(this.animate.bind(this))

        // Cube animation
       // this.cube.rotation.x += 0.01;
       // this.cube.rotation
        this.renderer.render(this.scene, this.camera)
        // render players
        for (let i = 0; i < 4; i++){
            
        }
    }

    startRound(eventType: GameStateChangedEventTypes, deckInfo: GameStateEventInfo) {
        console.log("startRound")
        this.setActivePlayer(deckInfo.newActivePlayerId)
    }
    setPlayers() {
        console.log("setPlayers")
        const startPosition = new THREE.Vector3(0, 0.3, 0)
        var axis = new THREE.Vector3(0, 0, 1);
        var angle = Math.PI / 2;
        const slots=[]
        for (let i = 0; i < 4; i++){
            
            const player = this.players[i]
            player.setAvatar()
            this.container.appendChild(player.avatar)
            const pivot = new THREE.Object3D()
            pivot.name = "player_" + i
            pivot.position.copy(startPosition)
            this.scene.add(pivot)
            player.handPosition = pivot
        
            const slotPosition = pivot.position.clone()
            slots.push(slotPosition.multiplyScalar(0.2))
            startPosition.applyAxisAngle(axis, -angle);
        }
        const potPosition = new THREE.Vector3()
        Card.pot.setSlots(this.scene, potPosition ,slots)
    }

    setActivePlayer(playerId: number) {
        console.log("setActivePlayer "+playerId)
        this.activePlayer = this.players[playerId]
        this.players.forEach(p => {
            p.setInactive()
        })
        this.activePlayer.setActive()
        console.log("now=>"+this.activePlayer.id)
    }

    onResize() {
        console.log("onResize") 
        const container = this.container
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight

        this.renderer.setSize(containerWidth, containerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.domElement.style.height="100%"
        this.camera.aspect = containerWidth / containerHeight;
        this.camera.updateProjectionMatrix()
        window.camera = this.camera
    }
        // Render Loop

}