import { nextTurn } from "../../turnHandler.js";
import { enemy } from "./enemy.js";
import { updateActionText, takeDamage, showStringEnemy, shakeScreen } from "../../pages/gamePage.js";
import { addHound } from "./hound.js";
import { addWarrior } from "./warrior.js";
import { addSniper } from "./sniper.js";
import { addSlime } from "./slime.js";
import { addCentaur } from "./centaur.js";

class dragon extends enemy {
    constructor(x, y) {
        if (spritesheet.length == 0) {
            createSpriteSheet();
        }
        super("Dragon", x, y, 30, 1, new PIXI.AnimatedSprite(spritesheet.idle), new weapon("Breath", 7, 7, -1, 1), 10, -20);
        this.isModified = enemyVal.ogrechange;
        this.isPrep = false;
        this.curAttack = 3;
        this.attack1Sprite = new PIXI.AnimatedSprite(attack1Ssheet);
        this.attack1Sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.attack1Sprite.scale.set(3, 3);
        this.attack1Sprite.anchor.set(0.5);
        this.attack1Sprite.animationSpeed = 0.15;
        this.attack1Sprite.stop();
        this.attack1Sprite.loop = false;
        this.attack1Sprite.x = xCentral;
        this.attack1Sprite.y = yCentral + 5;
        this.attack2coords = [];
        this.attack2container = new PIXI.Container();
        this.attack3coords = [];
        this.attack3sprites = [];
        this.attack3container = new PIXI.Container();
    }

    nextMove() {
        if (this.health <= 0) {
            endTurn(this);
            return;
        }

        let move = "";
        switch (this.curAttack) {
            case 1:
                if (this.isPrep) {
                    move = "attack1";
                    this.isPrep = false;
                    this.curAttack++;
                } else {
                    move = "prep1";
                    this.isPrep = true;
                }
                break;
            case 2:
                if (this.isPrep) {
                    move = "attack2";
                    this.isPrep = false;
                    this.curAttack++;
                } else {
                    move = "prep2";
                    this.isPrep = true;
                    while (this.attack2coords.length < 3) {
                        let check = Math.floor(Math.random() * 3);
                        let coords = findCoords(check);
                        let flag = true;
                        for (let i = 0; i < this.attack2coords.length; i++) {
                            if (this.attack2coords[i][0] == coords[0] && this.attack2coords[i][1] == coords[1]) {
                                flag = false;
                                break;
                            }
                        }
                        if (check != player.x + player.y * 9 && checkValidity(coords[0], coords[1]) && flag) {
                            this.attack2coords.push(coords);
                        }
                    }
                }
                break;
            case 3:
                if (this.isPrep) {
                    move = "attack3";
                    this.isPrep = false;
                    this.curAttack++;
                } else {
                    move = "prep3";
                    this.isPrep = true;
                    while (this.attack3coords.length < 10) {
                        let check = Math.floor(Math.random() * 44);
                        let coords = findCoords(check);
                        let flag = true;
                        for (let i = 0; i < this.attack3coords.length; i++) {
                            if (this.attack3coords[i][0] == coords[0] && this.attack3coords[i][1] == coords[1]) {
                                flag = false;
                                break;
                            }
                        }
                        if (check != player.x + player.y * 9 && checkValidity(coords[0], coords[1]) && flag) {
                            this.attack3coords.push(coords);
                        }
                    }
                }
                break;
            case 4:
                if (this.isPrep) {
                    move = "attack2";
                    this.isPrep = false;
                    this.curAttack = 1;
                } else {
                    move = "prep2";
                    this.isPrep = true;
                    while (this.attack2coords.length < 3) {
                        let check = Math.floor(Math.random() * 44);
                        let coords = findCoords(check);
                        let flag = true;
                        for (let i = 0; i < this.attack2coords.length; i++) {
                            if (this.attack2coords[i][0] == coords[0] && this.attack2coords[i][1] == coords[1]) {
                                flag = false;
                                break;
                            }
                        }
                        if (check != player.x + player.y * 9 && checkValidity(coords[0], coords[1]) && flag) {
                            this.attack2coords.push(coords);
                        }
                    }
                }
                break;
        }
        this.move(move);
    }

    move(move) {
        ResolveMoves(this, move);
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
                enemies.forEach(function (element) {
                    element.takeDamage(element.health, false, "left");
                });
            } else {
                toggleHurt(this, dir);
                this.helpertext.text = `${this.name}  (${this.health}HP)\nRange:${this.weapon.range} Dmg:${this.weapon.mindmg}-${this.weapon.maxdmg}\nAP:${this.ap}`;
            }
        }
    }

    death() {
        bgContainer.removeChild(this.attack2container);
        bgContainer.removeChild(this.attack3container);
        bgContainer.removeChild(this.attack1Sprite);
        deathanimation(this);
    }
}

export function addDragon() {
    enemies.push(new dragon(8, 2));
}

function endTurn(enemy) {
    if (enemy.sprite.playing) {
        setTimeout(function () { endTurn(enemy); }, 100);
        return;
    }
    enemyTurnCounter++;
    setTimeout(nextTurn, 250);
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

var spritesheet = [];
let ssheet = dragonssheet;
const attack1Texture = new PIXI.BaseTexture.from('images/enemy/dragonattack1_spritesheet.png');
const attack1Ssheet = [new PIXI.Texture(attack1Texture, new PIXI.Rectangle(0 * 144, 0 * 48, 144, 48)), new PIXI.Texture(attack1Texture, new PIXI.Rectangle(0 * 144, 1 * 48, 144, 48)),
new PIXI.Texture(attack1Texture, new PIXI.Rectangle(0 * 144, 2 * 48, 144, 48)), new PIXI.Texture(attack1Texture, new PIXI.Rectangle(0 * 144, 3 * 48, 144, 48))]
const spawnTexture = new PIXI.Texture.from('images/enemy/spawn_warning.png');
const attack3Texture = new PIXI.BaseTexture.from('images/enemy/dragonattack3_spritesheet.png');
const attack3Ssheet = [new PIXI.Texture(attack3Texture, new PIXI.Rectangle(0 * 16, 0 * 16, 16, 16)), new PIXI.Texture(attack3Texture, new PIXI.Rectangle(1 * 16, 0 * 16, 16, 16)),
new PIXI.Texture(attack3Texture, new PIXI.Rectangle(2 * 16, 0 * 16, 16, 16)), new PIXI.Texture(attack3Texture, new PIXI.Rectangle(3 * 16, 0 * 16, 16, 16))]
const rw = 32;
const rh = 32;


function createSpriteSheet() {
    spritesheet["idle"] = [new PIXI.Texture(ssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh))];
    spritesheet["prep"] = [new PIXI.Texture(ssheet, new PIXI.Rectangle(1 * rw, 0 * rh, rw, rh))];
    spritesheet["hurt"] = [new PIXI.Texture(ssheet, new PIXI.Rectangle(2 * rw, 0 * rh, rw, rh))];
    spritesheet["hurtprep"] = [new PIXI.Texture(ssheet, new PIXI.Rectangle(3 * rw, 0 * rh, rw, rh))];
    spritesheet["die"] = [new PIXI.Texture(ssheet, new PIXI.Rectangle(0 * rw, 1 * rh, rw, rh)), new PIXI.Texture(ssheet, new PIXI.Rectangle(1 * rw, 1 * rh, rw, rh)), new PIXI.Texture(ssheet, new PIXI.Rectangle(2 * rw, 1 * rh, rw, rh))];

}



function toggleHurt(enemy, dir, flag = true) {
    if (flag) {
        if (enemy.isPrep) {
            enemy.sprite.textures = spritesheet.hurtprep;
        } else {
            enemy.sprite.textures = spritesheet.hurt;
        }
        setTimeout(function () { toggleHurt(enemy, dir, false) }, 250);
    } else {
        if (enemy.isPrep) {
            enemy.sprite.textures = spritesheet.prep;
        } else {
            enemy.sprite.textures = spritesheet.idle;
        }
    }
}

function ResolveMoves(enemy, move) {
    switch (move) {
        case "prep1":
            showStringEnemy("Charging!", enemy);
            enemy.sprite.textures = spritesheet.prep;
            enemy.attack1Sprite.gotoAndStop(0);
            bgContainer.addChild(enemy.attack1Sprite);
            enemy.sprite.loop = false;
            dragonchargeAudio.currentTime = 0;
            dragonchargeAudio.play();
            break;
        case "attack1":
            bgContainer.removeChild(enemy.attack1Sprite);
            app.stage.addChild(enemy.attack1Sprite);
            enemy.attack1Sprite.play();
            if (player.y < 4 && player.y > 0 && player.x < 8) {
                player.takeDamage(enemy.weapon.attack());
            }
            dragonimpactAudio.currentTime = 0;
            dragonimpactAudio.play();
            shakeScreen();
            break;
        case "prep2":
            showStringEnemy("Summoning!", enemy);
            enemy.sprite.textures = spritesheet.prep;
            enemy.sprite.loop = false;
            enemy.attack2coords.forEach(function (element) {
                let sprite = new PIXI.Sprite(spawnTexture);
                sprite.scale.set(3, 3);
                sprite.anchor.set(0.5);
                sprite.x = realPositionX(element[0]);
                sprite.y = realPositionY(element[1]) + 5;
                enemy.attack2container.addChild(sprite);
            });
            bgContainer.addChild(enemy.attack2container);
            dragonchargeAudio.currentTime = 0;
            dragonchargeAudio.play();
            break;
        case "attack2":
            enemy.attack2coords.forEach(function (element) {
                let random = Math.floor(Math.random() * 5 + 1);
                let spawn = 0;
                switch (random) {
                    case 1:
                        spawn = addHound(element[0], element[1]);
                        break;
                    case 2:
                        spawn = addWarrior(element[0], element[1]);
                        break;
                    case 3:
                        spawn = addSniper(element[0], element[1]);
                        break;
                    case 4:
                        spawn = addSlime(element[0], element[1]);
                        break;
                    case 5:
                        spawn = addCentaur(element[0], element[1]);
                        break;
                }
                spawn.skipTurn = true;
            });
            enemies.forEach(function (element) {
                if (element.isAlive) {
                    element.draw(gameContainer);
                }
            });
            bgContainer.removeChild(enemy.attack2container);
            enemy.attack2container = new PIXI.Container();
            break;
        case "prep3":
            showStringEnemy("Charging!", enemy);
            enemy.sprite.textures = spritesheet.prep;
            enemy.sprite.loop = false;
            enemy.attack3coords.forEach(function (element) {
                let sprite = new PIXI.AnimatedSprite(attack3Ssheet);
                sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                sprite.scale.set(3, 3);
                sprite.anchor.set(0.5);
                sprite.animationSpeed = 0.15;
                sprite.stop();
                sprite.loop = false;
                sprite.x = realPositionX(element[0]);
                sprite.y = realPositionY(element[1]) + 5;
                enemy.attack3container.addChild(sprite);
                enemy.attack3sprites.push(sprite);
            });
            bgContainer.addChild(enemy.attack3container);
            dragonchargeAudio.currentTime = 0;
            dragonchargeAudio.play();
            break;
        case "attack3":
            enemy.attack3sprites.forEach(function (element, index) {
                element.play();
                if (player.x == enemy.attack3coords[index][0] && player.y == enemy.attack3coords[index][1]) {
                    player.takeDamage(enemy.weapon.attack());
                }
            });
            shakeScreen();
            dragonimpactAudio.currentTime = 0;
            dragonimpactAudio.play();
            break;
    }

    let total = 100;
    enemy.sprite.play();
    enemy.sprite.animationSpeed = .5;
    const step = () => {
        if (total == 0) {
            switch (move) {
                case "prep1":
                    break;
                case "attack1":
                    app.stage.removeChild(enemy.attack1Sprite);
                    enemy.sprite.textures = spritesheet.idle;
                case "attack2":
                    enemy.sprite.textures = spritesheet.idle;
                    enemy.attack2coords = [];
                case "attack3":
                    enemy.sprite.textures = spritesheet.idle;
                    bgContainer.removeChild(enemy.attack3container);
                    enemy.attack3container = new PIXI.Container();
                    enemy.attack3coords = [];
                    enemy.attack3sprites = [];
            }
        }
        if (total) {
            total--;
            switch (move) {
                default:
                    requestAnimationFrame(() => {
                        step();
                    })
                    return;
            }
        }
    }
    step();
}

function deathanimation(enemy) {
    enemy.sprite.textures = spritesheet.die;
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