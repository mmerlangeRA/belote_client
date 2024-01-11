import { FakeServer } from './FakeServer/FakeServer'
import { SiteGameState } from './Game'
import { SceneManager } from './SceneManager'
import './style.css'

const container3D = document.getElementById('container3D') as HTMLElement
const app = document.getElementById("app-container") as HTMLElement


const fakeServer = new FakeServer()
const game = new SiteGameState()
const sceneManager = new SceneManager(container3D, game.playerIds)




