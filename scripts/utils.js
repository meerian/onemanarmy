//Main application
const app = new PIXI.Application({
    view: document.getElementById("myCanvas"),
    backgroundColor: 0x160805,
});
const bgContainer = new PIXI.Container();
const gameContainer = new PIXI.Container();
const uiContainer = new PIXI.Container();
const moveContainer = new PIXI.Container();
const detailContainer = new PIXI.Container();

app.renderer.plugins.interaction.cursorStyles.default = "url('images/default_cursor.png'), auto";
app.renderer.plugins.interaction.cursorStyles.pointer = "url('images/aim_cursor.png'), auto";

app.stage.addChild(bgContainer);
let background = new PIXI.Sprite(new PIXI.Texture.from('images/backgrnd.png'));
background.x = 0;
background.y = 0;
background.scale.set(3, 3);
background.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
bgContainer.addChild(background);

// -------------------------------------------------------------------------------

//Main textstyle for the game
var font = new FontFaceObserver('Pixel');
font.load();

const textStyle = new PIXI.TextStyle({
    fontFamily: "Pixel",
    fontSize: 16,
    fill: "0x40FF40",
});

const textStyleCrit = new PIXI.TextStyle({
    fontFamily: "Pixel",
    fontSize: 16,
    fill: "0xFFDB2B",
});

const textStyleHelper = new PIXI.TextStyle({
    fontFamily: "Pixel",
    fontSize: 16,
    fill: "0xE0E0E0",
    dropShadow: true,
    dropShadowAlpha: 0.1
});

const textStyleUpgrade = new PIXI.TextStyle({
    fontFamily: "Pixel",
    fontSize: 12,
    fill: "0xFFFFFF",
});

//Default method to draw text with or without anchor
const drawText = (text, x, y, container, isAnchored = false) => {
    text.x = x;
    text.y = y;
    if (isAnchored) { text.anchor.set(0.5); }
    container.addChild(text);
};

// -------------------------------------------------------------------------------

//Audio

//general audio
const mouseoverAudio = new Audio("audio/mouseover.wav");
const pointerdownAudio = new Audio("audio/pointerdown.wav");
const levelclearAudio = new Audio("audio/levelclear.wav");
levelclearAudio.playbackRate = 1.3;
const negativeAudio = new Audio("audio/negative.wav");
negativeAudio.volume = 0.2;
const spawnAudio = new Audio("audio/spawn.wav");
spawnAudio.volume = 0.2;

//player audio
const walkAudio = new Audio("audio/walk.wav");
const shootAudio = new Audio("audio/shoot.wav");
const noammoAudio = new Audio("audio/noammo.wav");
const activeAudio = new Audio("audio/useactive.wav");
activeAudio.volume = 0.2;

//enemy audio
const enemymeleeAudio = new Audio("audio/enemymelee.wav");
enemymeleeAudio.volume = 0.5;
const enemyshootAudio = new Audio("audio/enemyshoot.wav");
enemyshootAudio.volume = 0.5;



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
    let curX = obj2.x;
    let curY = obj2.y;
    while (obj1.x != curX || obj1.y != curY) {
        dist++;
        if (obj1.x != curX) {
            if (obj1.x < curX) {
                curX -= 1;
            } else {
                curX += 1;
            }
            continue;
        }
        else if (obj1.y < curY) {
            curY -= 1;
        } else {
            curY += 1;
        }
    }
    return dist;
}

function distApartCoord(obj1, x, y) {
    let dist = 0;
    let curX = x;
    let curY = y;
    while (obj1.x != curX || obj1.y != curY) {
        dist++;
        if (obj1.x != curX) {
            if (obj1.x < curX) {
                curX -= 1;
            } else {
                curX += 1;
            }
            continue;
        }
        else if (obj1.y < curY) {
            curY -= 1;
        } else {
            curY += 1;
        }
    }
    return dist;
}

function findCoords(num) {
    return [num % 9, ~~(num / 9)];
}

// -------------------------------------------------------------------------------

//User textures and animations
const userssheet = new PIXI.BaseTexture.from("images/user_spritesheet.png");
const rw = 16;
const rh = 16;

//enemy textures and animations
const houndssheet = new PIXI.BaseTexture.from("images/enemy/hound_spritesheet.png");
const warriorssheet = new PIXI.BaseTexture.from("images/enemy/warrior_spritesheet.png");
const sniperssheet = new PIXI.BaseTexture.from("images/enemy/sniper_spritesheet.png");
const slimessheet = new PIXI.BaseTexture.from("images/enemy/slime_spritesheet.png");
const centaurssheet = new PIXI.BaseTexture.from("images/enemy/centaur_spritesheet.png");
const ogressheet = new PIXI.BaseTexture.from("images/enemy/ogre_spritesheet.png");
const dragonssheet = new PIXI.BaseTexture.from("images/enemy/dragon_spritesheet.png");

const upgradessheet = new PIXI.BaseTexture.from("images/upgrade/upgrades_spritesheet.png");
const modssheet = new PIXI.BaseTexture.from("images/upgrade/mods_spritesheet.png");
const spawnssheet = new PIXI.BaseTexture.from("images/spawn_spritesheet.png");


// -------------------------------------------------------------------------------

//Common classes
class gameObject {
    constructor(x, y, health, ap, sprite, weapon, xNudge = 0, yNudge = 0) {
        this.x = x;
        this.y = y;
        this.xNudge = xNudge;
        this.yNudge = yNudge;
        this.ap = ap;
        this.health = health;
        this.sprite = sprite;
        this.sprite.animationSpeed = .5;
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(3, 3);
        this.sprite.autoUpdate = true;
        this.sprite.loop = true;
        this.sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.weapon = weapon;
    }

    draw(container) {
        this.sprite.x = xCentral + (this.x - 4) * 48 + this.xNudge;
        this.sprite.y = yCentral + (this.y - 2) * 48 + this.yNudge;
        container.addChild(this.sprite);
        animateSpawn(this.sprite.x, this.sprite.y, container);
    }
}

let spritesheet = [new PIXI.Texture(spawnssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh)), new PIXI.Texture(spawnssheet, new PIXI.Rectangle(1 * rw, 0 * rh, rw, rh)), new PIXI.Texture(spawnssheet, new PIXI.Rectangle(2 * rw, 0 * rh, rw, rh))];

function animateSpawn(x, y, container) {
    let sprite = new PIXI.AnimatedSprite(spritesheet);
    sprite.x = x;
    sprite.y = y;
    sprite.animationSpeed = .3;
    sprite.anchor.set(0.5);
    sprite.scale.set(3, 3);
    sprite.loop = true;
    sprite.play();
    spawnAudio.currentTime = 0;
    spawnAudio.play();
    container.addChild(sprite);
    let total = 50;
    const step = () => {
        total--;
        if (total == 0) {
            sprite.stop();
            container.removeChild(sprite);
            return;
        }
        requestAnimationFrame(() => {
            step();
        })
    }
    step();
}

class weapon {
    constructor(name, mindmg, maxdmg, clip, range, flavourtext, texture, critchance = 0) {
        this.className = "Weapon";
        this.name = name;
        this.mindmg = mindmg;
        this.maxdmg = maxdmg;
        this.weapontext = `(damage:${mindmg}-${maxdmg}, range:${range})`;
        this.clip = clip;
        this.bullets = clip;
        this.range = range;
        this.flavourtext = flavourtext;
        this.texture = texture;
        this.critchance = critchance;
        this.guncalibrated = false;
    }

    update() {
        this.mindmg = Math.min(Math.max(this.mindmg + playerVal.mindmgmodifier, 1), this.maxdmg + playerVal.maxdmgmodifier);
        this.maxdmg = Math.max(this.maxdmg + playerVal.maxdmgmodifier, this.mindmg);
        this.critchance = this.critchance + playerVal.critmodifier;
        this.clip = this.clip + playerVal.clipmodifier;
        this.bullets = this.clip;
        this.range = Math.max(this.range + playerVal.rangemodifier, 1);
        this.weapontext = `(damage:${this.mindmg}-${this.maxdmg}, range:${this.range})`;
        this.guncalibrated = playerVal.guncalibrated;
        this.bloodbullet = false;
    }

    updateCchance(crit) {
        this.critchance = this.critchance + crit;
    }

    updateCalibration() {
        this.guncalibrated = playerVal.guncalibrated;
    }

    updateDmg(mindmg = 0, maxdmg = 0) {
        this.mindmg = Math.min(Math.max(this.mindmg + mindmg, 1), this.maxdmg + maxdmg);
        this.maxdmg = Math.max(this.maxdmg + maxdmg, this.mindmg);
        this.weapontext = `(damage:${this.mindmg}-${this.maxdmg}, range:${this.range})`;
    }

    updateAmmo(clip) {
        this.clip = this.clip + clip;
        this.bullets = this.clip;
    }

    updateRange(range) {
        this.range = Math.max(this.range + range, 1);
        this.weapontext = `(damage:${this.mindmg}-${this.maxdmg}, range:${this.range})`;
    }

    updateBloodbullet(bool) {
        this.bloodbullet = bool;
    }

    attack(isCrit = false, costBullet = true) {
        let dmg = 0;
        if (this.guncalibrated) {
            dmg = Math.floor((this.mindmg + this.maxdmg) / 2);
        } else {
            dmg = Math.floor(Math.random() * (this.maxdmg - this.mindmg + 1) + this.mindmg);
        }
        if (this.bloodbullet) {
            dmg += 2;
            player.takeDamage([1, false]);
        }
        if (costBullet) {
            this.bullets--;
        }
        let ccroll = Math.random();
        if (isCrit || ccroll < this.critchance) {
            return [dmg * 2, true];
        } else {
            return [dmg, false];
        }
    }

    reload() {
        this.bullets = this.clip;
    }

    checkFire() {
        return this.bullets < 0 || this.clip == -1;
    }
}

class upgrade {
    constructor(type, name, flavourtext, shortdesc, texture) {
        this.className = type;
        this.name = name;
        this.flavourtext = flavourtext;
        this.shortdesc = shortdesc;
        this.texture = texture;
    }

    apply() {
        throw new Error("method apply() not implemented.");
    }

    //Methods to be implemented for active items
    reload() {

    }

    use() {

    }
}

class page {
    constructor(container) {
        this.container = container;
    }

    init() {
        this.createPage();
        this.stage();
        this.animate();
    }

    createPage() {
        throw new Error("method createPage() not implemented.");
    }

    animate() {
        
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