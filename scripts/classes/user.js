import { nextTurn } from "../turnHandler.js";
import { moveIndicator } from "./moveIndicator.js";
import { showString, updateAP, updateBulletText, updateHealth } from "../pages/gamePage.js";

class user extends gameObject {
    constructor(x, y, health, ap, weapon) {
        createSpriteSheet();
        super(x, y, health, ap, new PIXI.AnimatedSprite(spritesheet.idleright), weapon, 5, -15);
        playerVal.health = health;
        playerVal.ap = ap;
        this.mIndicator = 0;
    }

    displayMove(direction) {
        if (isPlayerturn) {
            if (this.mIndicator == 0) {
                this.mIndicator = new moveIndicator(this.x, this.y, playerVal.ap);
            }
            this.mIndicator.update(direction);
        }   
    }

    takeDamage(val) {
        playerVal.health -= val;
        updateHealth(val);
    }

    attack(dir) {
        playerVal.ap--;
        if (player.mIndicator != 0) {
            player.mIndicator.ap = playerVal.ap;
        }
        updateBulletText();
        updateAP();
        drawShoot(dir);
    }

    reload() {
        if (isPlayerturn) {
            if (player.weapon.bullets == player.weapon.clip) {
                showString("Ammo Full!");
                return;
            }
            playerVal.ap--;
            this.weapon.reload();
            updateBulletText();
            updateAP();
            showString("Reloaded!");
        }
    }

    move(x, y, moves) {
        this.x = x;
        this.y = y;
        let movesCopy = [...moves];

        drawAnimation(movesCopy);
    }

    endTurn() {
        playerVal.ap = 0;
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
    if (playerVal.ap > 0 || player.sprite.playing) {
        setTimeout(function () { playerTurn(); }, 100);
    } else {
        //End turn
        playerVal.ap = player.ap;
        if (player.mIndicator != 0) {
            player.mIndicator.ap = playerVal.ap;
            player.mIndicator.cleanup();
        }
        updateAP();
        isPlayerturn = false;
        nextTurn();
    }
}

function drawShoot(dir) {
    let total = 30;
    if (dir == "right") {
        player.sprite.textures = spritesheet.shootright;
    } else {
        player.sprite.textures = spritesheet.shootleft;
    }
    
    player.sprite.play();
    const step = () => {
        if (total) {
            total--;
            requestAnimationFrame(() => {
                step();
            })
            return;
        }
        else {
            if (dir == "left") {
                player.sprite.textures = spritesheet.idleleft;
            } else if (dir == "right") {
                player.sprite.textures = spritesheet.idleright;
            }
            return;
        }
    }
    step();
}

function drawAnimation(moves) {
    if (moves[0]) {
        let str = moves.shift();
        if (player.sprite.textures == spritesheet.idleright) {
            player.sprite.textures = spritesheet.walkright;
        }
        if (str == "left") {
            player.sprite.textures = spritesheet.walkleft;
        } else if (str == "right") {
            player.sprite.textures = spritesheet.walkright;
        }
        let total = 48;
        const step = () => {
            if (total == 0) {
                if (str == "left") {
                    player.sprite.textures = spritesheet.idleleft;
                } else {
                    player.sprite.textures = spritesheet.idleright;
                }
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
    spritesheet["idleright"] = [new PIXI.Texture(userssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh))];
    spritesheet["idleleft"] = [new PIXI.Texture(userssheet, new PIXI.Rectangle(0 * rw, 1 * rh, rw, rh))];
    spritesheet["walkright"] = [new PIXI.Texture(userssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(1 * rw, 0 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(2 * rw, 0 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(1 * rw, 0 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh))];
    spritesheet["walkleft"] = [new PIXI.Texture(userssheet, new PIXI.Rectangle(0 * rw, 1 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(1 * rw, 1 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(2 * rw, 1 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(1 * rw, 1 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(0 * rw, 1 * rh, rw, rh))];
    spritesheet["shootright"] = [new PIXI.Texture(userssheet, new PIXI.Rectangle(3 * rw, 0 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(3 * rw, 0 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(4 * rw, 0 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(5 * rw, 0 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(5 * rw, 0 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(3 * rw, 0 * rh, rw, rh))];
    spritesheet["shootleft"] = [new PIXI.Texture(userssheet, new PIXI.Rectangle(3 * rw, 1 * rh, rw, rh)),
        new PIXI.Texture(userssheet, new PIXI.Rectangle(3 * rw, 1 * rh, rw, rh)),
        new PIXI.Texture(userssheet, new PIXI.Rectangle(4 * rw, 1 * rh, rw, rh)),
        new PIXI.Texture(userssheet, new PIXI.Rectangle(5 * rw, 1 * rh, rw, rh)),
        new PIXI.Texture(userssheet, new PIXI.Rectangle(5 * rw, 1 * rh, rw, rh)),
        new PIXI.Texture(userssheet, new PIXI.Rectangle(3 * rw, 1 * rh, rw, rh))];
}

