//Main application
const app = new PIXI.Application({
    view: document.getElementById("myCanvas"),
});

const moveContainer = new PIXI.Container();

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

const textStyleHelper = new PIXI.TextStyle({
    fontFamily: "Pixel",
    fontSize: 16,
    fill: "0xFFFFFF",
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

function realPositionX(x) {
    return xCentral + (x - 4) * 48;
}

function realPositionY(y) {
    return yCentral + (y - 2) * 48;
}

function distApartObj(obj1, obj2) {
    let dist = 0;
    let curX = obj2.x + obj1.xNudge - obj2.xNudge;
    let curY = obj2.y + obj1.yNudge - obj2.yNudge;
    while (obj1.x != curX || obj1.y != curY) {
        dist++;
        if (obj1.x != curX) {
            if (obj1.x < curX) {
                curX -= 48;
            } else {
                curX += 48;
            }
            continue;
        }
        else if (obj1.y < curY) {
            curY -= 48;
        } else {
            curY += 48;
        }
    }
    return dist;
}

function distApartCoord(obj1, x, y) {
    let dist = 0;
    let curX = x;
    let curY = y;
    if (curX > obj1.x) {
        while (curX - obj1.x > 0) {
            dist++;
            curX -= 48;
        }
    } else {
        while (obj1.x - curX > 0) {
            dist++;
            curX += 48;
        }
    }
    if (curY > obj1.y) {
        while (curY - obj1.y > 0) {
            dist++;
            curY -= 48;
        }
    } else {
        while (obj1.y - curY > 0) {
            dist++;
            curY += 48;
        }
    }
    return dist;
}

// -------------------------------------------------------------------------------

//User textures and animations
const userssheet = new PIXI.BaseTexture.from("images/user_spritesheet.png");
const rw = 16;
const rh = 16;

//enemy textures and animations
const houndssheet = new PIXI.BaseTexture.from("images/enemy/hound_spritesheet.png");


        


// -------------------------------------------------------------------------------

//Common classes
class gameObject {
    constructor(x, y, health, ap, sprite, weapon, xNudge = 0, yNudge = 0) {
        this.x = xCentral + (x - 4) * 48 + xNudge;
        this.y = yCentral + (y - 2) * 48 + yNudge;
        this.xNudge = xNudge;
        this.yNudge = yNudge;
        this.ap = ap;
        this.health = health;
        this.sprite = sprite;
        this.sprite.animationSpeed = .5;
        this.sprite.loop = false;
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(3, 3);;
        this.sprite.autoUpdate = true;
        this.sprite.loop = true;
        this.sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.weapon = weapon;
        this.sprite.play();
    }

    draw(container) {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        container.addChild(this.sprite);
    }
}

class weapon {
    constructor(name, mindmg, maxdmg, clip, range) {
        this.name = name;
        this.weapontext = "(damage:" + mindmg + "-" + maxdmg + ", range:" + range + ")";
        this.mindmg = mindmg;
        this.maxdmg = maxdmg;
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