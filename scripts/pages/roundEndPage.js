import { parseUpgrade, applyUpgrade } from "../classes/mods/upgradeList.js";
import { startLevel } from "../turnHandler.js";

export class roundEndPage extends page {
    constructor() {
        super(roundendContainer)
        this.upgrades = [];
        curPage = this;
    }
    
    init() {
        this.chooseUpgrades();
        this.createPage();
        this.stage();
    }

    createPage() {
        //Create title
        drawText(new PIXI.Text("Choose A Modification", textStyle), xCentral, yCentral - 200, this.container, true);
        //Create selections
        for (let i = -1; i <= 1; i++) {
            let upgrade = this.upgrades.pop();
            let container = new PIXI.Container();
            container.interactive = true;

            //Create box
            let choiceBox = new PIXI.Graphics();
            choiceBox.lineStyle(1, 0x00FF2A, 1);
            choiceBox.drawRect(xCentral - 100 + i * 200, yCentral - 150, 200, 300);
            choiceBox.endFill();
            choiceBox.hitArea = new PIXI.Rectangle(xCentral - 100 + i * 200, yCentral - 150, 200, 300);
            container.addChild(choiceBox);

            //Create image
            let image = new PIXI.Sprite(upgrade.texture);
            image.x = xCentral - 80 + i * 200;
            image.y = yCentral - 125;
            image.scale.set(3, 3);
            image.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            container.addChild(image);

            //Create text
            let textStyleChoice = { ...textStyle };
            let choiceBoxText = new PIXI.Text(`${upgrade.className}:\n${upgrade.name}`, textStyleChoice);
            drawText(choiceBoxText, xCentral - 10 + i * 200, yCentral - 120, container, false);
            let choiceboxflavourText = new PIXI.Text(upgrade.flavourtext, textStyleChoice);
            drawText(choiceboxflavourText, xCentral - 70 + i * 200, yCentral - 30, container, false);
            container.on("pointerdown", function (event) {
                endPage(upgrade);
            })
            container.on("mouseover", function (event) {
                choiceBox.clear();
                choiceBox.lineStyle(2, 0x00FF2A, 1);
                choiceBox.drawRect(xCentral - 100 + i * 200, yCentral - 150, 200, 300);
                choiceBox.endFill();
            })
            container.on("mouseout", function (event) {
                choiceBox.clear();
                choiceBox.lineStyle(1, 0x00FF2A, 1);
                choiceBox.drawRect(xCentral - 100 + i * 200, yCentral - 150, 200, 300);
                choiceBox.endFill();
            })
            this.container.addChild(container);
        }
    }

    chooseUpgrades() {
        let counter = 3;
        while (counter > 0) {
            //Should be multiplied by number of upgrades
            let check = Math.floor(Math.random() * 3 + 1);
            if (!this.upgrades.includes(check)) {
                this.upgrades.push(check);
                counter--;
            }
        }
        for (let i = 0; i < this.upgrades.length; i++) {
            
            this.upgrades[i] = parseUpgrade(this.upgrades[i]);
        }
    }
}

let curPage = 0;

function endPage(upgrade) {
    applyUpgrade(upgrade);
    curPage.cleanup();
    startLevel();
}

const roundendContainer = new PIXI.Container();