import { nextTurn } from "../turnHandler.js";
import { moveIndicator } from "./moveIndicator.js";
import { updateAP, updateBulletText, updateHealth } from "../pages/gamePage.js";

class user extends gameObject {
    constructor(x, y, health, ap, weapon) {
        createSpriteSheet();
        super(x, y, health, ap, new PIXI.AnimatedSprite(spritesheet.idle), weapon, 5, -15);
        this.mIndicator = 0;
    }

    displayMove(direction) {
        if (this.mIndicator == 0) {
            this.mIndicator = new moveIndicator(this.x, this.y, playerVal.ap);
        }
        this.mIndicator.update(direction);
    }

    takeDamage(val) {
        playerVal.health -= val;
        updateHealth(val);
    }

    attack() {
        playerVal.ap--;
        updateBulletText();
        updateAP();
    }

    reload() {
        playerVal.ap--;
        this.weapon.reload();
        updateBulletText();
        updateAP();
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
        if (player.mIndicator != 0) {
            player.mIndicator.ap = playerVal.ap;
        }
        updateAP();
        isPlayerturn = false;
        nextTurn();
    }
}

function drawAnimation(moves) {
    if (moves[0]) {
        player.sprite.textures = spritesheet.walk;
        let str = moves.shift();
        let total = 48;
        const step = () => {
            if (total == 0) {
                player.sprite.textures = spritesheet.idle;
            }
            if (total) {
                player.sprite.play();
                total--;
                switch (str) {
                    case "up":
                        player.sprite.y -= 1;
                        requestAnimationFrame(() => {
                            step();
                        })
                        return;
                    case "down":
                        player.sprite.y += 1;
                        requestAnimationFrame(() => {
                            step();
                        })
                        return;
                    case "right":
                        player.sprite.x += 1;
                        requestAnimationFrame(() => {
                            step();
                        })
                        return;
                    case "left":
                        player.sprite.x -= 1;
                        requestAnimationFrame(() => {
                            step();
                        })
                        return;
                }
            }
        }
        step();
        setTimeout(function () { drawAnimation(moves) }, 170);
    }

}

var spritesheet = [];

function createSpriteSheet() {
    spritesheet["idle"] = [new PIXI.Texture(userssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh))];
    spritesheet["walk"] = [new PIXI.Texture(userssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(1 * rw, 0 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(2 * rw, 0 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(1 * rw, 0 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh))];
}

