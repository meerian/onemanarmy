import { checkValidity, parseUpgrade } from "../classes/mods/upgradeList.js";
import { createModpage } from "./modPage.js";

class upgradePage extends page {
    constructor() {
        super(upgradeContainer)
        this.upgrades = [];
        curPage = this;
    }
    
    init() {
        this.chooseUpgrades();
        this.createPage();
        this.stage();
        this.animate();
    }

    createPage() {
        let animationOffset = 950;

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
            choiceBox.drawRect(xCentral - 100 + i * 200, yCentral - 150 + animationOffset, 200, 300);
            choiceBox.endFill();
            choiceBox.hitArea = new PIXI.Rectangle(xCentral - 100 + i * 200, yCentral - 150 + animationOffset, 200, 300);
            container.addChild(choiceBox);
            pageElements.push(choiceBox);

            //Create image
            let image = new PIXI.Sprite(upgrade.texture);
            image.x = xCentral - 80 + i * 200;
            image.y = yCentral - 125 + animationOffset;
            image.scale.set(3, 3);
            image.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            container.addChild(image);
            pageElements.push(image);

            //Create text
            let textStyleChoice = { ...textStyle };
            let choiceBoxText = new PIXI.Text(`${upgrade.className}:\n${upgrade.name}`, textStyleChoice);
            drawText(choiceBoxText, xCentral - 10 + i * 200, yCentral - 120 + animationOffset, container, false);
            pageElements.push(choiceBoxText);
            let choiceboxflavourText = new PIXI.Text(upgrade.flavourtext, textStyleChoice);
            drawText(choiceboxflavourText, xCentral - 70 + i * 200, yCentral - 50 + animationOffset, container, false);
            pageElements.push(choiceboxflavourText);
            container.on("pointerdown", function (event) {
                pointerdownAudio.currentTime = 0;
                pointerdownAudio.play();
                upgrade.apply();
                endPage();
            })
            container.on("mouseover", function (event) {
                mouseoverAudio.currentTime = 0;
                mouseoverAudio.play();
                choiceBox.clear();
                choiceBox.lineStyle(2, 0x00FF2A, 1);
                choiceBox.drawRect(xCentral - 100 + i * 200, yCentral - 150 + animationOffset, 200, 300);
                choiceBox.endFill();
            })
            container.on("mouseout", function (event) {
                choiceBox.clear();
                choiceBox.lineStyle(1, 0x00FF2A, 1);
                choiceBox.drawRect(xCentral - 100 + i * 200, yCentral - 150 + animationOffset, 200, 300);
                choiceBox.endFill();
            })
            this.container.addChild(container);
        }
    }

    chooseUpgrades() {
        let counter = 3;
        while (counter > 0) {
            //Should be multiplied by number of upgrades
            let check = Math.floor(Math.random() * 20 + 1);
            if (!this.upgrades.includes(check) && checkValidity(check)) {
                this.upgrades.push(check);
                counter--;
            }
        }
        for (let i = 0; i < this.upgrades.length; i++) {
            
            this.upgrades[i] = parseUpgrade(this.upgrades[i]);
        }
    }

    animate() {
        animatePage();
    }
}

const upgradeContainer = new PIXI.Container();
let curPage = 0;
let pageElements = [];
let moveFlag = false;

export function createUpgradepage() {
    let page = new upgradePage();
    page.init();
}

function endPage() {
    if (!moveFlag) {
        animatePage(false);
        moveFlag = true;
        return;
    }
    pageElements = [];
    curPage.cleanup();
    createModpage();
}

//Default is moving up
function animatePage(dir = true) {
    let total = 40;
    const step = () => {
        total--;
        if (total == 0) {
            if (!dir) {
                endPage();
            }
            return;
        }
        pageElements.forEach(function (element) {
            if (dir) {
                element.y-= 25;
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

