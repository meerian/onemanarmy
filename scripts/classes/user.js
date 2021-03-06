import { nextTurn } from "../turnHandler.js";
import { moveIndicator } from "./moveIndicator.js";
import { levelEnd, levelFail, shakeScreen, showString, updateAP, updateBulletText, updateHealth } from "../pages/gamePage.js";
import { pistol } from "./mods/upgradeList.js";

class user extends gameObject {
    constructor(x, y) {
        if (playerVal.weapon == 0) {
            playerVal.weapon = new pistol();
            playerVal.weapon.apply();
        }
        createSpriteSheet();
        super(x, y, playerVal.maxhealth, playerVal.maxap, new PIXI.AnimatedSprite(spritesheet.idleright), playerVal.weapon, 5, -15);
        playerVal.health = this.health;
        playerVal.ap = this.ap;
        this.weapon.reload();
        this.mIndicator = 0;
        this.attackFlag = true;
        this.canShoot = true;
        this.isAlive = true;
    }

    displayMove(direction) {
        if (isPlayerturn) {
            if (this.mIndicator == 0) {
                this.mIndicator = new moveIndicator(this.x, this.y, playerVal.ap);
            }
            this.mIndicator.update(direction);
        }
    }

    takeDamage(val, toAP = false) {
        if (playerVal.nextNoDmg || playerVal.firstturnNoDmg) {
            showString("Damage Negated!");
            playerVal.nextNoDmg = false;
        } else if (toAP) {
            playerVal.ap = Math.max(1, playerVal.ap - val[0]);
            this.updateAP();
            showString("-1 AP!");
        } else {
            playerVal.health -= val[0];
            updateHealth(val[0], val[1]);
            shakeScreen();
            if (playerVal.health <= 0) {
                this.isAlive = false;
                deathAnimation();
            }
        }
    }

    attack(enemy, canShoot = this.canShoot) {
        if (this.attackFlag && canShoot) {
            let dmgtaken = [];
            let enemies = [];
            let bulletFlag = true;
            enemies.push(enemy);

            //If shotgun, adds surrounding enemies into array
            if (this.weapon.name == "Shotgun") {
                let x = enemy.x;
                let y = enemy.y;
                let dir = 0;
                if (enemy.x == player.x) {
                    dir = "x";
                } else {
                    dir = "y";
                }
                // E.g. y == check y -1 and y + 1 (as enemy is aligned on x-axis)
                checkAround(enemies, x, y, dir);
            }
            enemies.forEach(function () {
                if (playerVal.nextIsCrit) {
                    playerVal.nextIsCrit = false;
                    dmgtaken.push(player.weapon.attack(true, bulletFlag));
                } else {
                    dmgtaken.push(player.weapon.attack(false, bulletFlag));
                }
                if (bulletFlag) {
                    bulletFlag = false;
                }
            })
            if (enemy.x < player.x) {
                drawShoot("left");
                enemies.forEach(function (element, index) {
                    element.takeDamage(dmgtaken[index][0], dmgtaken[index][1], "right");
                })
            } else {
                drawShoot("right");
                enemies.forEach(function (element, index) {
                    element.takeDamage(dmgtaken[index][0], dmgtaken[index][1], "left");
                })
            }
            updateBulletText();
            if (playerVal.nextExpendAll && player.weapon.bullets > 0) {
                this.canShoot = false;
                setTimeout(function () { player.attack(enemy, true) }, 300);
                return;
            }
            let chance = Math.random() < 0.3;
            if (chance && this.weapon.name == "SMG") {
                showString("Free Shot!");
            } else if (playerVal.nextExpendAll) {
                playerVal.ap = 0;
                playerVal.nextExpendAll = false;
                this.canShoot = true;
            } else {
                playerVal.ap--;
                if (player.mIndicator != 0) {
                    player.mIndicator.cleanup();
                    player.mIndicator.ap = playerVal.ap;
                }
                updateAP();
            }
            this.attackFlag = false
            setTimeout(function () { player.attackFlag = true }, 300);
        }
    }

    reload(isFree = false) {
        if (isPlayerturn) {
            if (player.weapon.bullets == player.weapon.clip) {
                negativeAudio.currentTime = 0;
                negativeAudio.play();
                showString("Ammo Full!");
                return;
            }
            if (!isFree) {
                activeAudio.currentTime = 0;
                activeAudio.play();
                playerVal.ap--;
                if (player.mIndicator != 0) {
                    player.mIndicator.cleanup();
                    player.mIndicator.ap = playerVal.ap;
                }
            }
            this.weapon.reload();
            updateBulletText();
            updateAP();
            showString("Reloaded!");
        }
    }

    updateAP() {
        if (this.mIndicator != 0) {
            player.mIndicator.cleanup();
            player.mIndicator.ap = playerVal.ap;
        }
        updateAP();
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

    cheer() {
        cheerAnimation();
    }
}

// -------------------------------------------------------------------------------

//Public methods
export function addUser(x, y) {
    player = new user(x, y);
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
        setTimeout(nextTurn, 250);
    }
}

function drawShoot(dir) {
    shootAudio.currentTime = 0;
    shootAudio.play();
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
        walkAudio.currentTime = 0;
        walkAudio.play();
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
                walkAudio.pause();
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

function cheerAnimation() {
    let total = 200;
    player.sprite.textures = spritesheet.cheer;
    player.sprite.animationSpeed = 0.2;
    player.sprite.play();
    const step = () => {
        total--;
        if (total == 0) {
            levelEnd();
            return;
        }
        requestAnimationFrame(() => {
            step();
        })
    }
    step();
}

function deathAnimation() {
    let total = 150;
    loseAudio.currentTime = 0;
    loseAudio.play();
    if (player.sprite.textures == spritesheet.idleleft) {
        player.sprite.textures = spritesheet.dieleft;
    } else {
        player.sprite.textures = spritesheet.dieright;
    }
    player.sprite.loop = false;
    player.sprite.play();
    const step = () => {
        total--;
        if (total == 0) {
            levelFail();
            return;
        }
        requestAnimationFrame(() => {
            step();
        })
    }
    step();

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
    spritesheet["cheer"] = [new PIXI.Texture(userssheet, new PIXI.Rectangle(0 * rw, 2 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(1 * rw, 2 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(2 * rw, 2 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(1 * rw, 2 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(0 * rw, 2 * rh, rw, rh))];
    spritesheet["dieright"] = [new PIXI.Texture(userssheet, new PIXI.Rectangle(0 * rw, 3 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(1 * rw, 3 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(2 * rw, 3 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(3 * rw, 3 * rh, rw, rh))];
    spritesheet["dieleft"] = [new PIXI.Texture(userssheet, new PIXI.Rectangle(0 * rw, 4 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(1 * rw, 4 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(2 * rw, 4 * rh, rw, rh)),
    new PIXI.Texture(userssheet, new PIXI.Rectangle(3 * rw, 4 * rh, rw, rh))];
}

