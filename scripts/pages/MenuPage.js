import { startLevel } from "../turnHandler.js";

class menuPage extends page {
    constructor() {
        super(menuContainer);
        curPage = this;
        this.helperContainer = 0;
        this.startContainer = 0;
        this.helpContainer = 0;
    }

    init() {
        this.createPage();
        this.stage();
        this.animate();
    }

    createPage() {
        this.createControls();
        let animationOffset = 950;

        //Create title
        drawText(new PIXI.Text("One Man Army", textStyle), xCentral, yCentral - 200, this.container, true);

        //Create start container
        this.startContainer = new PIXI.Container();
        this.startContainer.interactive = true;

        //Create start box
        let startBox = new PIXI.Graphics();
        startBox.lineStyle(1, 0x00FF2A, 1);
        startBox.drawRect(xCentral - 80, yCentral - 100 + animationOffset, 160, 30);
        startBox.endFill();
        startBox.hitArea = new PIXI.Rectangle(xCentral - 80, yCentral - 100 + animationOffset, 160, 30);
        this.startContainer.addChild(startBox);
        pageElements.push(startBox);

        //Create start Text
        let textStyleStart = { ...textStyle };
        let StartBoxText = new PIXI.Text(`Start`, textStyleStart);
        drawText(StartBoxText, xCentral, yCentral - 85 + animationOffset, this.startContainer, true);
        pageElements.push(StartBoxText);
        this.startContainer.on("pointerdown", function (event) {
            pointerdownAudio.currentTime = 0;
            pointerdownAudio.play();
            endPage();
        })
        this.startContainer.on("mouseover", function (event) {
            mouseoverAudio.currentTime = 0;
            mouseoverAudio.play();
            startBox.clear();
            startBox.lineStyle(2, 0x00FF2A, 1);
            startBox.drawRect(xCentral - 80, yCentral - 100 + animationOffset, 160, 30);
            startBox.endFill();
        })
        this.startContainer.on("mouseout", function (event) {
            startBox.clear();
            startBox.lineStyle(1, 0x00FF2A, 1);
            startBox.drawRect(xCentral - 80, yCentral - 100 + animationOffset, 160, 30);
            startBox.endFill();
        })
        this.container.addChild(this.startContainer);
        
        //Create controls container
        this.helpContainer = new PIXI.Container();
        this.helpContainer.interactive = true;

        //Create control box
        let controlBox = new PIXI.Graphics();
        controlBox.lineStyle(1, 0x00FF2A, 1);
        controlBox.drawRect(xCentral - 80, yCentral - 30 + animationOffset, 160, 30);
        controlBox.endFill();
        controlBox.hitArea = new PIXI.Rectangle(xCentral - 80, yCentral - 30 + animationOffset, 160, 30);
        this.helpContainer.addChild(controlBox);
        pageElements.push(controlBox);

        //Create control Text
        let textStyleControl = { ...textStyle };
        let ControlBoxText = new PIXI.Text(`How to Play`, textStyleControl);
        drawText(ControlBoxText, xCentral, yCentral - 15 + animationOffset, this.helpContainer, true);
        pageElements.push(ControlBoxText);
        this.helpContainer.on("pointerdown", function (event) {
            pointerdownAudio.currentTime = 0;
            pointerdownAudio.play();
            curPage.addHelper();
            curPage.startContainer.interactive = false;
            curPage.helpContainer.interactive = false;
        })
        this.helpContainer.on("mouseover", function (event) {
            mouseoverAudio.currentTime = 0;
            mouseoverAudio.play();
            controlBox.clear();
            controlBox.lineStyle(2, 0x00FF2A, 1);
            controlBox.drawRect(xCentral - 80, yCentral - 30 + animationOffset, 160, 30);
            controlBox.endFill();
        })
        this.helpContainer.on("mouseout", function (event) {
            controlBox.clear();
            controlBox.lineStyle(1, 0x00FF2A, 1);
            controlBox.drawRect(xCentral - 80, yCentral - 30 + animationOffset, 160, 30);
            controlBox.endFill();
        })
        this.container.addChild(this.helpContainer);
    }

    createControls() {
        this.helperContainer = new PIXI.Container();
        this.helperContainer.interactive = true;

        let box = new PIXI.Graphics();
        box.lineStyle(1, 0x00FF2A, 1);
        box.beginFill(0x160805);
        box.drawRect(xCentral - 250, yCentral - 150, 500, 300);
        box.endFill();
        box.hitArea = new PIXI.Rectangle(0, 0, app.renderer.width, app.renderer.height);
        this.helperContainer.addChild(box);

        //Create start Text
        let help = "One Man Army is a turn based game where each \nentity takes turns to move. \n\n" +
            "How to Play: \n" +
            "Each turn, players have a set number of action points (AP) \nwhich can be used to: \n" +
            "1) Move using WASD or ARROW KEYS \n" +
            "2) Shoot an enemy by clicking the enemy targeted \n" +
            "3) Reload your gun by clicking the reload button at the bottom\n" +
            "4) Use your items by clicking on their icons in your inventory\n\n" +
            "Fight your way through the 6 levels in the forest\n and escape the demon horde! \n";

        let text = new PIXI.Text(help, textStyle);
        drawText(text, xCentral, yCentral, this.helperContainer, true);

        let closeText = new PIXI.Text("<click anywhere to close>", textStyle);
        drawText(closeText, xCentral, yCentral + 125, this.helperContainer, true);

        this.helperContainer.on("pointerdown", function (event) {
            pointerdownAudio.currentTime = 0;
            pointerdownAudio.play();
            curPage.removeHelper();
            setTimeout(function() { curPage.startContainer.interactive = true; curPage.helpContainer.interactive = true; }, 100);
        })
    }

    addHelper() {
        this.container.addChild(this.helperContainer);
    }

    removeHelper() {
        this.container.removeChild(this.helperContainer);
    }
    animate() {
        animatePage();
    }
}

const menuContainer = new PIXI.Container();
let curPage = 0;
let pageElements = [];
let moveFlag = false;

export function createMenuPage() {
    let page = new menuPage();
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

