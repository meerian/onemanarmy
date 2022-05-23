import { nextTurn } from "../turnHandler.js";
import { moveIndicator } from "./moveIndicator.js";
import { updateAP } from "../pages/gamePage.js";

class user extends gameObject {
    constructor(x, y, health, ap, weapon) {
        super(x, y, health, ap, new PIXI.Sprite(PIXI.Texture.from("../images/user.png")), weapon);
        this.mIndicator = 0;
    }

    displayMove(direction) {
        if (this.mIndicator == 0) {
            this.mIndicator = new moveIndicator(this.x, this.y, playerVal.ap);
        }
        this.mIndicator.update(direction);
    }

    takeDamage() {
    }

    getLocation() {
        var curLocation = [this.x, this.y];
        return curLocation;
    }

    move(x, y, moves) {
        this.x = x;
        this.y = y;
        let movesCopy = [...moves];
        drawAnimation(movesCopy);
    }
}

// -------------------------------------------------------------------------------

//Public methods
export function addUser(x, y, health, ap, weapon) {
    player = new user(x, y, health, ap, weapon);
}

export function drawUser(container) {
    player.draw(container);
}

export function emptyUser() {
    player = 0;
}

export function playerTurn() {
    if (playerVal.ap > 0) {
        setTimeout(function () { playerTurn(); }, 100);
    } else {
        //End turn
        playerVal.ap = player.ap;
        player.mIndicator.ap = playerVal.ap;
        updateAP();
        nextTurn();
    }
}

function drawAnimation(moves) {
    if (moves[0]) {
        let str = moves.shift();
        let total = 24;
        const step = () => {
            if (total) {
                total--;
                switch (str) {
                    case "up":
                            player.sprite.y -= 2;
                            requestAnimationFrame(() => {
                                step();
                            })
                            return;
                    case "down":
                            player.sprite.y += 2;
                            requestAnimationFrame(() => {
                                step();
                            })
                            return;
                    case "right":
                            player.sprite.x += 2;
                            requestAnimationFrame(() => {
                                step();
                            })
                            return;
                    case "left":
                            player.sprite.x -= 2;
                            requestAnimationFrame(() => {
                                step();
                            })
                            return;
                }
            }
        }
        step();
        setTimeout(function() { drawAnimation(moves) }, 170);
    }
    
}