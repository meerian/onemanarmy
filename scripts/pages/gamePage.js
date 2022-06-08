import { addHound } from "../classes/enemies/hound.js";
import { addWarrior } from "../classes/enemies/warrior.js";
import { addUser } from "../classes/user.js";
import { createUpgradepage } from "./upgradePage.js";
import { nextTurn } from "../turnHandler.js";
import { addSniper } from "../classes/enemies/sniper.js";
import { addSlime } from "../classes/enemies/slime.js";
import { addCentaur } from "../classes/enemies/centaur.js";
import { addOgre } from "../classes/enemies/ogre.js";
import { addDragon } from "../classes/enemies/dragon.js";

export class gamePage extends page {
    constructor() {
        super(gameContainer);
        curPage = this;
        this.uicontainer = uiContainer;
    }

    createPage() {
        let animationOffset = 980;

        //Draw Level
        drawText(new PIXI.Text(`Level ${gamelevel}`, textStyle), xCentral, yCentral - 200, uiContainer, true);

        //Add grid
        let grid = new PIXI.Sprite(new PIXI.Texture.from('images/grid.png'));
        grid.x = xCentral;
        grid.y = yCentral + animationOffset;
        grid.anchor.set(0.5);
        grid.scale.set(3, 3);
        grid.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.container.addChild(grid);
        pageElements.push(grid);

        //add user
        addUser(1, 2);

        //add enemies
        let startingY = 2;
        let curY = 2;
        let curX = 7;
        curSpawn.forEach(function (element) {
            switch (element) {
                case "hound":
                    addHound(curX, curY);
                    break;
                case "warrior":
                    addWarrior(curX, curY);
                    break;
                case "sniper":
                    addSniper(curX, curY);
                    break;
                case "slime":
                    addSlime(curX, curY);
                    break;
                case "centaur":
                    addCentaur(curX, curY);
                    break;
                case "ogre":
                    addOgre(curX, curY);
                    break;
                case "dragon":
                    addDragon();
            }
            curY = enemySpawnCoord[curY];
            if (curY == -1) {
                curX--;
                curY = startingY;
            }    
        });
    }
    stage() {
        app.stage.addChild(uiContainer);
        app.stage.addChild(gameContainer);
        app.stage.addChild(moveContainer);
        app.stage.addChild(detailContainer);
    }

    animate() {
        animatePage();
    }

    drawEnemies() {
        if (drawIndex >= enemies.length) {
            clearInterval(drawInterval);
            isPlayerturn = true;
            if (enemyVal.caltrops) {
                enemies.forEach(function (element) {
                    element.takeDamage(enemyVal.caltrops, false, "left");
                })
            }
            nextTurn();
            return;
        } else {
            enemies[drawIndex].draw(gameContainer);
            drawIndex++;
        }
    }

    drawUI() {
        //Draw inventory
        drawText(new PIXI.Text("Inventory:", textStyle), xCentral - 300, yCentral - 115, uiContainer, true);
        playerInventory.forEach(function (element, index) {
            //Create image
            let text = new PIXI.Text(`${element.name} \n ${element.shortdesc}`, textStyleUpgrade);
            text.x = xCentral - 300 + index % 2 * 50;
            text.y = yCentral - 80 + Math.floor(index / 2) * 40;
            let image = new PIXI.Sprite(element.texture);
            image.x = xCentral - 350 + index % 2 * 50;
            image.y = yCentral - 90 + Math.floor(index / 2) * 40;
            image.scale.set(2, 2);
            image.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            image.interactive = true;
            if (element.className != "Passive") {
                image.on("pointerdown", function (event) {
                    element.use();
                    text.text = `${element.name} \n ${element.shortdesc}`;
                })
            }
            image.on("mouseover", function (event) {
                gameContainer.addChild(text);
            })
            image.on("mouseout", function (event) {
                gameContainer.removeChild(text);
            })
            gameContainer.addChild(image);
        });

        //Draw user health
        drawText(new PIXI.Text("Health:", textStyle), xCentral - 300, yCentral + 155, uiContainer, true);
        healthText = new PIXI.Text(playerVal.health, textStyle);
        drawText(healthText, xCentral - 300, yCentral + 175, uiContainer, true);

        //Draw user AP
        drawText(new PIXI.Text("AP:", textStyle), xCentral - 225, yCentral + 155, uiContainer, true);
        apText = new PIXI.Text(playerVal.ap, textStyle);
        drawText(apText, xCentral - 228, yCentral + 175, uiContainer, true);

        //Draw user weapon
        drawText(new PIXI.Text(`Weapon: ${player.weapon.name}`, textStyle), xCentral - 100, yCentral + 155, uiContainer, true);
        weaponText = new PIXI.Text(player.weapon.weapontext, textStyle);
        drawText(weaponText, xCentral - 103, yCentral + 175, uiContainer, true);

        //Draw clip
        bTextContainer = new PIXI.Container();
        bTextContainer.interactive = true;
        bTextContainer.on("pointerdown", function (event) {
            player.reload();
        })
        bulletText = new PIXI.Text("Ammo: " + player.weapon.bullets, textStyle);
        drawText(bulletText, xCentral + 50, yCentral + 155, bTextContainer, true);
        drawText(new PIXI.Text("(Click to reload)", textStyle), xCentral + 50, yCentral + 175, bTextContainer, true);
        uiContainer.addChild(bTextContainer);

        //Draw Action
        drawText(new PIXI.Text("Action:", textStyle), xCentral + 250, yCentral + 155, uiContainer, true);
        actionText = new PIXI.Text("", textStyle);
        drawText(actionText, xCentral + 250, yCentral + 175, uiContainer, true);

        //Draw current turn
        turnText = new PIXI.Text("Player's Turn", textStyle);
        drawText(turnText, xCentral, yCentral - 3 * 48, uiContainer, true);

        //Draw end turn button
        const endTurnContainer = new PIXI.Container();
        endTurnContainer.interactive = true;
        endTurnContainer.hitArea = new PIXI.Rectangle(xCentral + 308, yCentral + 93, 80, 30);
        let endTurnBox = new PIXI.Graphics();
        endTurnBox.lineStyle(1, 0x40FF40, 1);
        endTurnBox.drawRect(xCentral + 308, yCentral + 93, 80, 30);
        endTurnBox.endFill();
        endTurnContainer.addChild(endTurnBox);
        let textStyleEndTurn = {
            ...textStyle
        };
        endTurnButton = new PIXI.Text("End Turn", textStyleEndTurn);
        endTurnButton.interactive = true;
        endTurnContainer.on("pointerdown", function (event) {
            pointerdownAudio.currentTime = 0;
            pointerdownAudio.play();
            player.endTurn();
        })
        endTurnContainer.on("mouseover", function (event) {
            mouseoverAudio.currentTime = 0;
            mouseoverAudio.play();
            endTurnButton.style.fill = "0x160805";
            endTurnBox.beginFill(0x40FF40);
            endTurnBox.drawRect(xCentral + 308, yCentral + 93, 80, 30);
            endTurnBox.endFill();
        })
        endTurnContainer.on("mouseout", function (event) {
            endTurnButton.style.fill = "0x40FF40";
            endTurnBox.clear();
            endTurnBox.lineStyle(1, 0x40FF40, 1);
            endTurnBox.drawRect(xCentral + 308, yCentral + 93, 80, 30);
            endTurnBox.endFill();
        })
        drawText(endTurnButton, xCentral + 350, yCentral + 110, endTurnContainer, true);
        uiContainer.addChild(endTurnContainer);
    }

    cleanup() {
        while (this.container.children[0]) {
            this.container.removeChild(this.container.children[0]);
        }
        while (this.uicontainer.children[0]) {
            this.uicontainer.removeChild(this.uicontainer.children[0]);
        }
        app.stage.removeChild(this.container);
        app.stage.removeChild(this.uicontainer);
    }
}

var drawInterval = 0;
var drawIndex = 0;
var pageElements = [];
var bTextContainer = 0
var endTurnButton = 0;
var curPage = 0;
var apText = 0;
var healthText = 0;
var turnText = 0;
var weaponText = 0;
var actionText = 0;
var bulletText = 0;
var cheerflag = false;

//Default is moving up
function animatePage(dir = true) {
    let total = 40;
    const step = () => {
        total--;
        if (total == 0) {
            curPage.drawUI();
            setTimeout(drawPage, 200);
            return;
        }
        pageElements.forEach(function (element) {
            if (dir) {
                element.y -= 25;
            } else {
                element.y += 25;
            }

        })

        requestAnimationFrame(() => {
            step();
        })
    }
    step();
}

function drawPage() {
    player.draw(gameContainer);
    drawInterval = setInterval(curPage.drawEnemies, 200);
}

export function updateAP() {
    apText.text = playerVal.ap;
}

export function updateHealth(val, iscrit) {
    healthText.text = playerVal.health;
    let dmgText = 0;
    if (iscrit) {
        dmgText = new PIXI.Text(`-${val}!`, textStyleCrit);
    } else {
        dmgText = new PIXI.Text(`-${val}`, textStyle);
    }
    drawText(dmgText, player.sprite.x, player.sprite.y - 20, gameContainer, true);
    drawAnimation(dmgText);

}

export function takeDamage(enemy, val, iscrit) {
    let dmgText = 0;
    if (iscrit) {
        dmgText = new PIXI.Text(`-${val}!`, textStyleCrit);
    } else {
        dmgText = new PIXI.Text(`-${val}`, textStyle);
    }
    drawText(dmgText, enemy.sprite.x, enemy.sprite.y - 20, gameContainer, true);
    drawAnimation(dmgText);
}

export function showString(str) {
    let text = new PIXI.Text(str, textStyle);
    drawText(text, player.sprite.x, player.sprite.y - 20, gameContainer, true);
    drawAnimation(text);
}

export function showStringEnemy(str, enemy) {
    let text = new PIXI.Text(str, textStyle);
    drawText(text, enemy.sprite.x, enemy.sprite.y - 20, gameContainer, true);
    drawAnimation(text);
}

function drawAnimation(text) {
    let total = 100;
    const step = () => {
        total--;
        if (total == 0) {
            gameContainer.removeChild(text);
            return;
        }
        if (total) {
            text.y -= 0.25;
        }
        requestAnimationFrame(() => {
            step();
        })
    }
    step();
}
export function updateActionText(text) {
    actionText.text = text;
}

export function updateBulletText() {
    bulletText.text = "Ammo: " + player.weapon.bullets;
}

export function removeItem(item) {
    gameContainer.removeChild(item.sprite);
}

export function updateTurnText() {
    if (isPlayerturn) {
        turnText.text = "Player's Turn";
    } else {
        turnText.text = "Enemy's Turn";
    }

}

export function shakeScreen() {
    let total = 6;
    const step = () => {
        total--;
        if (total == 0) {
            gameContainer.x = 0;
            return;
        }
        if (total % 2 == 0) {
            gameContainer.x = 3;
        } else {
            gameContainer.x = -3;
        }
        setTimeout(step, 100);
    }
    step();
}

export function levelEnd() {
    if (!cheerflag) {
        isPlayerturn = false;
        if (player.mIndicator != 0) {
            player.mIndicator.cleanup();
        }
        bTextContainer.interactive = false;
        endTurnButton.interactive = false;
        turnText.text = "Level Cleared!"
        player.cheer();
        cheerflag = true;
        levelclearAudio.currentTime = 0;
        levelclearAudio.play();
        return;
    }
    //resets values
    resetenemyTurn();
    cheerflag = false;
    gamelevel++;
    drawIndex = 0;
    enemies = [];
    enemyTurnCounter = 0;
    enemyDefeated = 0;
    playerInventory.forEach(function (element) {
        element.reload();
    })
    curPage.cleanup();

    //Adds new enemies
    curSpawn = enemySpawnList[gamelevel].concat(curSpawn);

    //load next page
    createUpgradepage();
}