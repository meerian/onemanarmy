import { nextTurn } from "../../turnHandler.js";
import { enemy } from "./enemy.js";
import { updateActionText, takeDamage, shakeScreen } from "../../pages/gamePage.js";

class ogre extends enemy {
    constructor(x, y) {
        if (spritesheet.length == 0) {
            createSpriteSheet();
        }
        super("Ogre", x, y, 20, 3 + enemyVal.extramovement, new PIXI.AnimatedSprite(spritesheet.idleleft), new weapon("Fist", 6, 6, -1, 1), 0, -15);
        this.isModified = enemyVal.ogrechange;
        this.sprite.scale.set(2, 2);
        if (this.isModified) {
            this.weapon.updateDmg(-3, -3);
            this.helpertext.text = `${this.name}  (${this.health}HP)\nRange:${this.weapon.range} Dmg:${this.weapon.mindmg}-${this.weapon.maxdmg}\nAP:${this.ap}`;
            this.sprite.scale.set(1.5, 1.5);
        }
        this.isPrep = false;
        this.aimbox = new PIXI.AnimatedSprite(aimssheet);
        this.aimbox.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.aimbox.scale.set(3, 3);
        this.aimbox.anchor.set(0.5);
        this.aimbox.animationSpeed = 0.15;
        this.aimbox.stop();
        this.aimbox.loop = false;
        this.attackX = 0;
        this.attackY = 0;
    }

    nextMove() {
        if (this.skipTurn) {
            this.skipTurn = false;
            endTurn(this);
            return;
        }
        if (this.health <= 0) {
            endTurn(this);
            return;
        }
        let curX = this.x;
        let curY = this.y
        let curAP = this.ap;
        let xFlag = true;
        let attackFlag = true;
        while (curAP) {
            curAP--;
            if (!this.isModified && attackFlag && this.isPrep) {
                this.moves.push("attack");
                attackFlag = false;
                continue;
            }
            if (attackFlag && this.weapon.range >= distApartCoord(player, curX, curY)) {
                this.moves.push("prep");
                if (this.isModified) {
                    this.moves.push("attack");
                }
                break;
            }
            if (this.weapon.range >= distApartCoord(player, curX, curY)) {
                break;
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

    takeDamage(val, iscrit, dir) {
        if (this.isAlive) {
            takeDamage(this, val, iscrit);
            this.health -= val;
            if (this.health <= 0) {
                this.isAlive = false;
                this.sprite.interactive = false;
                detailContainer.removeChild(this.helpertext);
                updateActionText("");
                this.death();
            } else {
                let isPrep = this.sprite.textures == spritesheet["prepleft"] || this.sprite.textures == spritesheet["prepright"];
                toggleHurt(this, dir, isPrep);
                this.helpertext.text = `${this.name}  (${this.health}HP)\nRange:${this.weapon.range} Dmg:${this.weapon.mindmg}-${this.weapon.maxdmg}\nAP:${this.ap}`;
            }
        }
    }

    death() {
        bgContainer.removeChild(this.aimbox);
        deathanimation(this);
    }
}

export function addOgre(x, y) {
    let spawn = new ogre(x, y);
    enemies.push(spawn);
    return spawn;
}

function checkValidity(x, y) {
    if (x > 8 || x < 0 || y < 0 || y > 4) {
        return false;
    }
    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].x == x && enemies[i].y == y && enemies[i].health > 0) {
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
    setTimeout(nextTurn, 150);
}

var spritesheet = [];
let ssheet = ogressheet;
const aimTexture = new PIXI.BaseTexture.from('images/enemy/ogreaim_spritesheet.png');
const aimssheet = [new PIXI.Texture(aimTexture, new PIXI.Rectangle(0 * 48, 0 * 48, 48, 48)), new PIXI.Texture(aimTexture, new PIXI.Rectangle(1 * 48, 0 * 48, 48, 48)), new PIXI.Texture(aimTexture, new PIXI.Rectangle(2 * 48, 0 * 48, 48, 48)), new PIXI.Texture(aimTexture, new PIXI.Rectangle(3 * 48, 0 * 48, 48, 48))]
const rw = 32;
const rh = 32;


function createSpriteSheet() {
    spritesheet["idleleft"] = [new PIXI.Texture(ssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh))];
    spritesheet["walkleft"] = [new PIXI.Texture(ssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh)), new PIXI.Texture(ssheet, new PIXI.Rectangle(1 * rw, 0 * rh, rw, rh))];
    spritesheet["prepleft"] = [new PIXI.Texture(ssheet, new PIXI.Rectangle(2 * rw, 0 * rh, rw, rh))];
    spritesheet["attackleft"] = [new PIXI.Texture(ssheet, new PIXI.Rectangle(3 * rw, 0 * rh, rw, rh))];
    spritesheet["hurtleft"] = [new PIXI.Texture(ssheet, new PIXI.Rectangle(7 * rw, 0 * rh, rw, rh))];
    spritesheet["hurtprepleft"] = [new PIXI.Texture(ssheet, new PIXI.Rectangle(8 * rw, 0 * rh, rw, rh))];
    spritesheet["dieleft"] = [new PIXI.Texture(ssheet, new PIXI.Rectangle(4 * rw, 0 * rh, rw, rh)), new PIXI.Texture(ssheet, new PIXI.Rectangle(5 * rw, 0 * rh, rw, rh)), new PIXI.Texture(ssheet, new PIXI.Rectangle(6 * rw, 0 * rh, rw, rh))];
    spritesheet["idleright"] = [new PIXI.Texture(ssheet, new PIXI.Rectangle(0 * rw, 1 * rh, rw, rh))];
    spritesheet["walkright"] = [new PIXI.Texture(ssheet, new PIXI.Rectangle(0 * rw, 1 * rh, rw, rh)), new PIXI.Texture(ssheet, new PIXI.Rectangle(1 * rw, 1 * rh, rw, rh))];
    spritesheet["prepright"] = [new PIXI.Texture(ssheet, new PIXI.Rectangle(2 * rw, 1 * rh, rw, rh))];
    spritesheet["attackright"] = [new PIXI.Texture(ssheet, new PIXI.Rectangle(3 * rw, 1 * rh, rw, rh))];
    spritesheet["dieright"] = [new PIXI.Texture(ssheet, new PIXI.Rectangle(4 * rw, 1 * rh, rw, rh)), new PIXI.Texture(ssheet, new PIXI.Rectangle(5 * rw, 1 * rh, rw, rh)), new PIXI.Texture(ssheet, new PIXI.Rectangle(6 * rw, 1 * rh, rw, rh))];
    spritesheet["hurtright"] = [new PIXI.Texture(ssheet, new PIXI.Rectangle(7 * rw, 1 * rh, rw, rh))];
    spritesheet["hurtprepright"] = [new PIXI.Texture(ssheet, new PIXI.Rectangle(8 * rw, 1 * rh, rw, rh))];
}



function toggleHurt(enemy, dir, isPrep, flag = true) {
    if (flag) {
        if (isPrep) {
            if (dir == "left") {
                enemy.sprite.textures = spritesheet.hurtprepleft;
            } else {
                enemy.sprite.textures = spritesheet.hurtprepright;
            }
        } else {
            if (dir == "left") {
                enemy.sprite.textures = spritesheet.hurtleft;
            } else {
                enemy.sprite.textures = spritesheet.hurtright;
            }
        }
        setTimeout(function () { toggleHurt(enemy, dir, isPrep, false) }, 250);
    } else {
        if (isPrep) {
            if (dir == "left") {
                enemy.sprite.textures = spritesheet.prepleft;
            } else {
                enemy.sprite.textures = spritesheet.prepright;
            }
        } else {
            if (dir == "left") {
                enemy.sprite.textures = spritesheet.idleleft;
            } else {
                enemy.sprite.textures = spritesheet.idleright;
            }
        }
    }
}

function ResolveMoves(enemy, moves) {
    if (moves[0]) {
        let str = moves.shift();
        if (str == "prep") {
            if (player.x > enemy.x) {
                enemy.sprite.textures = spritesheet.prepright;
                str = "prepright";
                enemy.sprite.loop = false;
            } else {
                enemy.sprite.textures = spritesheet.prepleft;
                str = "prepleft";
                enemy.sprite.loop = false;
            }
            if (player.y == enemy.y) {
                if (str == "prepleft") {
                    enemy.aimbox.x = player.sprite.x - 5 - 48;
                    enemy.aimbox.y = player.sprite.y + 20;
                    enemy.attackX = player.x - 1;
                    enemy.attackY = player.y;
                } else {
                    enemy.aimbox.x = player.sprite.x - 5 + 48;
                    enemy.aimbox.y = player.sprite.y + 20;
                    enemy.attackX = player.x + 1;
                    enemy.attackY = player.y;
                }
            } else {
                if (player.y > enemy.y) {
                    enemy.aimbox.x = player.sprite.x - 5;
                    enemy.aimbox.y = player.sprite.y + 20 + 48;
                    enemy.attackX = player.x;
                    enemy.attackY = player.y + 1;
                } else {
                    enemy.aimbox.x = player.sprite.x - 5;
                    enemy.aimbox.y = player.sprite.y + 20 - 48;
                    enemy.attackX = player.x;
                    enemy.attackY = player.y - 1;
                }
            }
            bgContainer.addChild(enemy.aimbox);
            enemy.isPrep = true;
        } else if (str == "attack") {
            enemymeleeAudio.currentTime = 0;
            enemymeleeAudio.play();
            enemy.isPrep = false;
            enemy.aimbox.play();
            if (player.x > enemy.x) {
                enemy.sprite.textures = spritesheet.attackright;
                str = "attackright";
                enemy.sprite.loop = false;
            } else {
                enemy.sprite.textures = spritesheet.attackleft;
                str = "attackleft";
                enemy.sprite.loop = false;
            }
            if (Math.abs(player.x - enemy.attackX) <= 1 && Math.abs(player.y - enemy.attackY) <= 1) {
                player.takeDamage(enemy.weapon.attack());
            }
            shakeScreen();
        } else if (str == "left") {
            enemy.sprite.textures = spritesheet.walkleft;
            enemy.sprite.loop = true;
            walkAudio.currentTime = 0;
            walkAudio.play();
        } else {
            enemy.sprite.textures = spritesheet.walkright;
            enemy.sprite.loop = true;
            walkAudio.currentTime = 0;
            walkAudio.play();
        }
        let total = 48;
        enemy.sprite.play();
        enemy.sprite.animationSpeed = .2;
        const step = () => {
            if (total == 0) {
                if (str.includes("attack")) {
                    enemy.aimbox.gotoAndStop(0);
                    bgContainer.removeChild(enemy.aimbox);
                }
                if (str == "prepleft") {
                    enemy.sprite.textures = spritesheet.prepleft;
                    return;
                }
                if (str == "prepright") {
                    enemy.sprite.textures = spritesheet.prepright;
                    return;
                }
                if (str.includes("left") && !enemy.isPrep) {
                    enemy.sprite.textures = spritesheet.idleleft;
                }
                if (str.includes("right") && !enemy.isPrep) {
                    enemy.sprite.textures = spritesheet.idleright;
                }
                if (str == "up" || str == "down") {
                    enemy.sprite.textures = spritesheet.idleright;
                }
                walkAudio.pause();
            }
            if (total) {
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

function deathanimation(enemy) {
    if (enemy.sprite.textures == spritesheet.idleleft) {
        enemy.sprite.textures = spritesheet.dieleft;
    } else {
        enemy.sprite.textures = spritesheet.dieright;
    }
    enemy.sprite.play();
    enemy.sprite.loop = false;
    let total = 100;
    const step = () => {
        total--;
        if (total == 0) {
            enemy.remove();
            return;
        }
        requestAnimationFrame(() => {
            step();
        })
    }
    step();
}