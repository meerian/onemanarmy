import { nextTurn } from "../../turnHandler.js";
import { enemy } from "./enemy.js";

class hound extends enemy {
    constructor(x, y) {
        createSpriteSheet();
        super("Hound", x, y, 5, 3, new PIXI.AnimatedSprite(spritesheet.idleleft), new weapon("claw", 1, 1, -1, 1), -2, -15);
    }

    nextMove() {
        let curX = this.x;
        let curY = this.y
        let curAP = this.ap;
        let xFlag = true;
        while (curAP) {
            curAP--;
            if (this.weapon.range >= distApartCoord(player, curX, curY)) {
                this.moves.push("attack");
                continue;
            }
            if (xFlag && player.x != curX) {
                if (player.x > curX && checkValidity(curX + 1, curY)) {
                    curX += 1;
                    this.moves.push("right");
                } else if (player.x < curX && checkValidity(curX - 1, curY)) {
                    curX -= 1;
                    this.moves.push("left");
                }
                else if (checkValidity(curX, curY - 1) && this.moves[this.moves.length - 1] != "down") {
                    curY -= 1;
                    this.moves.push("up");
                    xFlag = true;
                } else if (checkValidity(curX, curY + 1) && this.moves[this.moves.length - 1] != "up") {
                    curY += 1;
                    this.moves.push("down");
                    xFlag = true;
                }
                continue;
            }
            if (player.y != curY) {
                if (player.y > curY && checkValidity(curX, curY + 1)) {
                    curY += 1;
                    this.moves.push("down");
                } else if (player.y < curY && checkValidity(curX, curY - 1)) {
                    curY -= 1;
                    this.moves.push("up");
                }
                else if (checkValidity(curX - 1, curY) && this.moves[this.moves.length - 1] != "right") {
                    curX -= 1;
                    this.moves.push("left");
                    xFlag = false;
                } else if (checkValidity(curX + 1, curY) && this.moves[this.moves.length - 1] != "left") {
                    curX += 1;
                    this.moves.push("right");
                    xFlag = false;
                }
                continue;
            }
        }
        this.move(curX, curY, this.moves);
    }

    move(x, y, moves) {
        this.x = x;
        this.y = y;
        let movesCopy = [...moves];
        ResolveMoves(this, movesCopy);
        this.moves = [];
        this.updateHelper();
        endTurn(this);
    }
}

export function addHound(x, y, health, ap, weapon) {
    enemies.push(new hound(x, y, health, ap, weapon));
}

function checkValidity(x, y) {
    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].x == x && enemies[i].y == y) {
            return false;
        }
    }
    return true;
}

function endTurn(enemy) {
    if (enemy.sprite.playing) {
        setTimeout(function () { endTurn(enemy); }, 100);
        return;
    }
    enemyTurnCounter++;
    nextTurn();
}

var spritesheet = [];

function createSpriteSheet() {
    spritesheet["idleleft"] = [new PIXI.Texture(houndssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh))];
    spritesheet["walkleft"] = [new PIXI.Texture(houndssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh)), new PIXI.Texture(houndssheet, new PIXI.Rectangle(1 * rw, 0 * rh, rw, rh))];
    spritesheet["attackleft"] = [new PIXI.Texture(houndssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh)), new PIXI.Texture(houndssheet, new PIXI.Rectangle(2 * rw, 0 * rh, rw, rh))];
    spritesheet["idleright"] = [new PIXI.Texture(houndssheet, new PIXI.Rectangle(0 * rw, 1 * rh, rw, rh))];
    spritesheet["walkright"] = [new PIXI.Texture(houndssheet, new PIXI.Rectangle(0 * rw, 1 * rh, rw, rh)), new PIXI.Texture(houndssheet, new PIXI.Rectangle(1 * rw, 1 * rh, rw, rh))];
    spritesheet["attackright"] = [new PIXI.Texture(houndssheet, new PIXI.Rectangle(0 * rw, 1 * rh, rw, rh)), new PIXI.Texture(houndssheet, new PIXI.Rectangle(2 * rw, 1 * rh, rw, rh))];
}

function ResolveMoves(enemy, moves) {
    if (moves[0]) {
        let str = moves.shift();
        if (str == "attack") {
            if (player.x > enemy.x) {
                enemy.sprite.textures = spritesheet.attackright;
                str = "attackright";
            } else {
                enemy.sprite.textures = spritesheet.attackleft;
                str = "attackleft";
            }
            player.takeDamage(enemy.weapon.attack());
        } else if (str == "left"){
            enemy.sprite.textures = spritesheet.walkleft;
        } else {
            enemy.sprite.textures = spritesheet.walkright;
        }
        let total = 48;
        const step = () => {
            if (total == 0) {
                if (str == "left" || str == "attackleft") {
                    enemy.sprite.textures = spritesheet.idleleft;
                } else {
                    enemy.sprite.textures = spritesheet.idleright;
                }
            }
            if (total) {
                enemy.sprite.play();
                total--;
                switch (str) {
                    case "up":
                        enemy.sprite.y -= 1;
                        requestAnimationFrame(() => {
                            step();
                        })
                        return;
                    case "down":
                        enemy.sprite.y += 1;
                        requestAnimationFrame(() => {
                            step();
                        })
                        return;
                    case "right":
                        enemy.sprite.x += 1;
                        requestAnimationFrame(() => {
                            step();
                        })
                        return;
                    case "left":
                        enemy.sprite.x -= 1;
                        requestAnimationFrame(() => {
                            step();
                        })
                        return;
                    default:
                        requestAnimationFrame(() => {
                            step();
                        })
                }
            }
        }
        step();
        setTimeout(function () { ResolveMoves(enemy, moves) }, 170);
    }

}