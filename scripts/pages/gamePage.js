import { addHound } from "../classes/enemies/hound.js";
import { addUser } from "../classes/user.js";
import { pistol } from "../classes/mods/upgradeList.js";
import { roundEndPage } from "./roundEndPage.js";

export class gamePage extends page {
    constructor() {
        super(gameContainer);
        curPage = this;
    }

    createPage() {
        //Add grid
        let grid = new PIXI.Sprite(new PIXI.Texture.from('images/grid.png'));
        grid.x = xCentral;
        grid.y = yCentral;
        grid.anchor.set(0.5);
        grid.scale.set(3, 3);
        grid.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.container.addChild(grid);

        //add user
        addUser(1, 2, playerVal.maxhealth, playerVal.maxap);
        player.draw(this.container);

        //add enemies
        addHound(7, 2);
        addHound(7, 3);
        resetenemyTurn();
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].draw(this.container);
        }

        //Draw Level
        drawText(new PIXI.Text(`Level ${gamelevel}`, textStyle), xCentral, yCentral - 200, this.container, true);

        //Draw inventory
        drawText(new PIXI.Text("Inventory:", textStyle), xCentral - 300, yCentral - 115, this.container, true);
        playerInventory.forEach(function (element, index) {
            //Create image
            let text = new PIXI.Text(`${element.name} \n ${element.shortdesc}`, textStyleUpgrade);
            text.x = xCentral - 300 + index%2 * 50;
            text.y = yCentral - 80 + Math.floor(index/2) * 40;
            let image = new PIXI.Sprite(element.texture);
            image.x = xCentral - 350 + index%2 * 50;
            image.y = yCentral - 90 + Math.floor(index/2) * 40;
            image.scale.set(2, 2);
            image.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            image.interactive = true;
            image.on("pointerdown", function (event) {
                console.log("click");
            })
            image.on("mouseover", function (event) {
                gameContainer.addChild(text);
            })
            image.on("mouseout", function (event) {
                gameContainer.removeChild(text);
            })
            gameContainer.addChild(image);
        });

        //Draw user health
        drawText(new PIXI.Text("Health:", textStyle), xCentral - 300, yCentral + 155, this.container, true);
        healthText = new PIXI.Text(playerVal.health, textStyle);
        drawText(healthText, xCentral - 300, yCentral + 175, this.container, true);

        //Draw user AP
        drawText(new PIXI.Text("AP:", textStyle), xCentral - 225, yCentral + 155, this.container, true);
        apText = new PIXI.Text(playerVal.ap, textStyle);
        drawText(apText, xCentral - 228, yCentral + 175, this.container, true);

        //Draw user weapon
        drawText(new PIXI.Text(`Weapon: ${player.weapon.name}`, textStyle), xCentral - 100, yCentral + 155, this.container, true);
        weaponText = new PIXI.Text(player.weapon.weapontext, textStyle);
        drawText(weaponText, xCentral - 103, yCentral + 175, this.container, true);

        //Draw clip
        bTextContainer = new PIXI.Container();
        bTextContainer.interactive = true;
        bTextContainer.on("pointerdown", function (event) {
            player.reload();
        })
        bulletText = new PIXI.Text("Ammo: " + player.weapon.bullets, textStyle);
        drawText(bulletText, xCentral + 50, yCentral + 155, bTextContainer, true);
        drawText(new PIXI.Text("(Click to reload)", textStyle), xCentral + 50, yCentral + 175, bTextContainer, true);
        gameContainer.addChild(bTextContainer);

        //Draw Action
        drawText(new PIXI.Text("Action:", textStyle), xCentral + 250, yCentral + 155, this.container, true);
        actionText = new PIXI.Text("", textStyle);
        drawText(actionText, xCentral + 250, yCentral + 175, this.container, true);

        //Draw current turn
        turnText = new PIXI.Text("Player's Turn", textStyle);
        drawText(turnText, xCentral, yCentral - 3 * 48, this.container, true);

        //Draw end turn button
        let endTurnBox = new PIXI.Graphics();
        endTurnBox.lineStyle(1, 0x00FF2A, 1);
        endTurnBox.drawRect(xCentral + 308, yCentral + 93, 80, 30);
        endTurnBox.endFill();
        this.container.addChild(endTurnBox);
        let textStyleEndTurn = {
            ...textStyle
        };
        endTurnButton = new PIXI.Text("End Turn", textStyleEndTurn);
        endTurnButton.interactive = true;
        endTurnButton.on("pointerdown", function (event) {
            player.endTurn();
        })
        endTurnButton.on("mouseover", function (event) {
            endTurnButton.style.fill = "0x160805";
            endTurnBox.beginFill(0x00FF2A);
            endTurnBox.drawRect(xCentral + 308, yCentral + 93, 80, 30);
            endTurnBox.endFill();
        })
        endTurnButton.on("mouseout", function (event) {
            endTurnButton.style.fill = "0x00FF2A";
            endTurnBox.clear();
            endTurnBox.lineStyle(1, 0x00FF2A, 1);
            endTurnBox.drawRect(xCentral + 308, yCentral + 93, 80, 30);
            endTurnBox.endFill();
        })
        drawText(endTurnButton, xCentral + 350, yCentral + 110, this.container, true);
    }
    stage() {
        app.stage.addChild(gameContainer);
        app.stage.addChild(moveContainer);
        app.stage.addChild(detailContainer);
    }
}

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

export function levelEnd() {
    if (!cheerflag) {
        bTextContainer.interactive = false;
        endTurnButton.interactive = false;
        turnText.text = "Level Cleared!"
        player.cheer();
        cheerflag = true;
        return;
    }
    enemies = [];
    enemyTurnCounter = 0;
    enemyDefeated = 0;
    isPlayerturn = true;
    let page = new roundEndPage();
    curPage.cleanup();
    page.init();
}