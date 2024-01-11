import { Player } from "./Player"

export class Team{
    name: string = ""
    player1= new Player("")
    player2 = new Player("")
    score=0
    constructor(name: string) {
        this.setName(name)
    }
    public setName(name: string) {
        this.name = name
    }
}