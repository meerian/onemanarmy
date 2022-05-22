//Main application
const app = new PIXI.Application({
    view: document.getElementById("myCanvas"),
    backgroundColor: 0xB9D980
});

// -------------------------------------------------------------------------------

//Main textstyle for the game
var font = new FontFaceObserver('Pixel');

font.load().then(function () {
  console.log('Output Sans has loaded.');
}).catch(function () {
  console.log('Output Sans failed to load.');
});

const textStyle = new PIXI.TextStyle({
    fontFamily: "Pixel",
    fontSize: 16,
    fill: "0x235823",
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
var yCentral = app.renderer.height / 2;
var xNudge = 16;
var yNudge= 16;

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