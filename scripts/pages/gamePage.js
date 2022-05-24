import { addHound } from "../classes/enemies/hound.js";
import { addUser } from "../classes/user.js";
import { pistol } from "../classes/weapons/pistol.js";

export class gamePage extends page {
    constructor() {
        super(gameContainer);
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
        addUser(1, 2, playerVal.health, playerVal.ap, new pistol());
        player.draw(this.container);

        //add enemies
        addHound(7, 2, 5, 3, 0);
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].draw(this.container);
        }
       
        //Draw user health
        drawText(new PIXI.Text("Health:", textStyle), xCentral - 250, yCentral + 155, this.container, true);
        healthText = new PIXI.Text(playerVal.health, textStyle);
        drawText(healthText, xCentral - 250, yCentral + 175, this.container, true);

        //Draw user AP
        drawText(new PIXI.Text("AP:", textStyle), xCentral - 150, yCentral + 155, this.container, true);
        apText = new PIXI.Text(playerVal.ap, textStyle);
        drawText(apText, xCentral - 153, yCentral + 175, this.container, true);

        //Draw user weapon
        drawText(new PIXI.Text("Weapon: " + player.weapon.name, textStyle), xCentral, yCentral + 155, this.container, true);
        weaponText = new PIXI.Text(player.weapon.weapontext, textStyle);
        drawText(weaponText, xCentral - 3, yCentral + 175, this.container, true);

        //Draw Action
        drawText(new PIXI.Text("Action:", textStyle), xCentral + 250, yCentral + 155, this.container, true);
        actionText = new PIXI.Text("", textStyle);
        drawText(actionText, xCentral + 250, yCentral + 175, this.container, true);

        //Draw current turn
        turnText = new PIXI.Text("Player's Turn", textStyle);
        drawText(turnText, xCentral, yCentral - 3 * 48, this.container, true);
    }
}

export var gameContainer = new PIXI.Container();
var apText = 0;
var healthText = 0;
var turnText = 0;
var weaponText = 0;
var actionText = 0;

export function updateAP() {
    apText.text = playerVal.ap;
}

export function updateHealth() {
    healthText.text = playerVal.health;
}

export function updateActionText(text) {
    actionText.text = text;
}