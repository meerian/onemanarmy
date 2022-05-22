//Main application
const app = new PIXI.Application({
    view: document.getElementById("myCanvas"),
});

let background = new PIXI.Sprite(new PIXI.Texture.from('images/backgrnd.png'));
background.x = 0;
background.y = 0;
background.scale.set(3, 3);
background.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
app.stage.addChild(background);

// -------------------------------------------------------------------------------

//Main textstyle for the game
var font = new FontFaceObserver('Pixel');
font.load();

const textStyle = new PIXI.TextStyle({
    fontFamily: "Pixel",
    fontSize: 16,
    fill: "0x00FF2A",
    dropShadow: true,
    dropShadowAlpha: 0.1
});

//Default method to draw text with or without anchor
const drawText = (text, x, y, container, isAnchored = false) => {
    text.x = x;
    text.y = y;
    if (isAnchored) { text.anchor.set(0.5); }
    container.addChild(text);
 };

// -------------------------------------------------------------------------------

var xCentral = app.renderer.width / 2;
var yCentral = 2 * app.renderer.height / 3;

//Common classes
class gameObject {
    constructor(x, y, health, ap, sprite, weapon) {
        this.x = xCentral + (x - 4) * 48;
        this.y = yCentral + (y - 2) * 48;
        this.ap = ap;
        this.health = health;
        this.sprite = sprite;
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(2, 2);;
        this.sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.weapon = weapon;
    }

    draw(container) {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        container.addChild(this.sprite);
    }

    updateLocation() {
        throw new Error("method updateLocation() not implemented.");
    }
}

class weapon {
    constructor(damage, clip, range) {
        this.damage = damage;
        this.clip = clip;
        this.range = range;
    }
}

class page {
    constructor(container) {
        this.container = container;
    }

    init() {
        this.createPage();
        this.stage();
    }

    createPage() {
        throw new Error("method createPage() not implemented.");
    }

    stage() {
        app.stage.addChild(this.container);
    }

    cleanup() {
        while (this.container.children[0]) {
            this.container.removeChild(this.container.children[0]);
        }
        app.stage.removeChild(this.container);
    }

}