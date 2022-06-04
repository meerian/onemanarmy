import { parseMod } from "../classes/mods/modList.js";
import { startLevel } from "../turnHandler.js";

class modPage extends page {
    constructor() {
        super(modContainer);
        this.mods = [];
        curPage = this;
    }
    
    init() {
        this.chooseMods();
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
            let mod = this.mods.pop();
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
            let image = new PIXI.Sprite(mod.texture);
            image.x = xCentral - 80 + i * 200;
            image.y = yCentral - 125 + animationOffset;
            image.scale.set(3, 3);
            image.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            container.addChild(image);
            pageElements.push(image);

            //Create text
            let textStyleChoice = { ...textStyle };
            let choiceBoxText = new PIXI.Text(`${mod.className}:\n${mod.name}`, textStyleChoice);
            drawText(choiceBoxText, xCentral - 10 + i * 200, yCentral - 120 + animationOffset, container, false);
            pageElements.push(choiceBoxText);
            let choiceboxflavourText = new PIXI.Text(mod.flavourtext, textStyleChoice);
            drawText(choiceboxflavourText, xCentral - 70 + i * 200, yCentral - 30 + animationOffset, container, false);
            pageElements.push(choiceboxflavourText);
            container.on("pointerdown", function (event) {
                pointerdownAudio.currentTime = 0;
                pointerdownAudio.play();
                mod.apply();
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

    chooseMods() {
        let counter = 3;
        while (counter > 0) {
            //Should be multiplied by number of mods
            let check = Math.floor(Math.random() * 7 + 1);
            if (!this.mods.includes(check)) {
                this.mods.push(check);
                counter--;
            }
        }
        for (let i = 0; i < this.mods.length; i++) {
            
            this.mods[i] = parseMod(this.mods[i]);
        }
    }

    animate() {
        animatePage();
    }
}

const modContainer = new PIXI.Container();
let curPage = 0;
let pageElements = [];
let moveFlag = false;

export function createModpage() {
    let page = new modPage();
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
    startLevel();
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

