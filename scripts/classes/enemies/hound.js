import { enemy } from "./enemy.js";

class hound extends enemy{
    constructor(x, y) {
        createSpriteSheet();
        super(x, y, 5, 3, new PIXI.AnimatedSprite(spritesheet.idle), new weapon("claw", 1, 1, -1, 1), -2, -15);
        this.helpertext.text = "Hound (" + this.health + "HP)\nRange:1 Dmg:2 \nAP:3";    
    }

    nextMove() {
        let curX = this.x;
        let curY = this.y
        let curAP = this.ap;
        while (curAP) {
            curAP--;
            if (this.weapon.range >= distApartCoord(player, curX, curY)) {
                this.moves.push("attack");
                continue;
            }
            if (player.x != curX) {
                if (player.x > curX) {
                    curX += 1;
                    this.moves.push("right");
                } else {
                    curX -= 1;
                    this.moves.push("left");   
                }
                continue;
            }
            if (player.y != curY) {
                if (player.y > curY) {
                    curY += 1;
                    this.moves.push("down");
                } else {
                    curY -= 1;
                    this.moves.push("up");
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
    }
}

export function addHound(x, y, health, ap, weapon) {
    enemies.push(new hound(x, y, health, ap, weapon));
}

var spritesheet = [];




function createSpriteSheet() {
    spritesheet["idle"] = [new PIXI.Texture(houndssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh))];
    spritesheet["walk"] = [new PIXI.Texture(houndssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh)), new PIXI.Texture(houndssheet, new PIXI.Rectangle(1 * rw, 0 * rh, rw, rh))];
    spritesheet["attack"] = [new PIXI.Texture(houndssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh)), new PIXI.Texture(houndssheet, new PIXI.Rectangle(2 * rw, 0 * rh, rw, rh))];
}

function ResolveMoves(enemy, moves) {
    if (moves[0]) {
        let str = moves.shift();
        if (str == "attack") {
            enemy.sprite.textures = spritesheet.attack;
            player.takeDamage(enemy.weapon.attack());
        } else {
            enemy.sprite.textures = spritesheet.walk;
        }
        let total = 48;
        const step = () => {
            if (total == 0) {
                enemy.sprite.textures = spritesheet.idle;
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
                    case "attack":
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