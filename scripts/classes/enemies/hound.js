import { updateActionText } from "../../pages/gamePage.js";
import { enemy } from "./enemy.js";

class hound extends enemy{
    constructor(x, y, health, ap, weapon) {
        createSpriteSheet();
        super(x, y, health, ap, new PIXI.AnimatedSprite(spritesheet.idle), weapon, -2, -15);
        this.distAway = distApartObj(player, this);
        this.sprite.on("pointerdown", function (event) {
            console.log();
        })
        this.sprite.on("mouseover", function (event) {
            mouseover(this.x, this.y);
        });

        this.sprite.on("mouseout", function (event) {
            mouseout();
        });
        //Draw box
        let helper = new PIXI.Graphics();
        helper.lineStyle(2, 0x5a5a5a, 1);
        helper.beginFill(0x808080);
        helper.drawRect(this.x + 5, this.y + 5, 110, 50);
        helper.endFill();
        detailContainer.addChild(helper);

        //Draw text
        let helpertext = new PIXI.Text("Hound\nRange:1 Dmg:2", textStyleHelper);
        helpertext.x = this.x + 10;
        helpertext.y = this.y + 10;
        detailContainer.addChild(helpertext);
    }

    nextMove() {
        let curAP = this.ap;
        while (curAP) {
            curAP--;
            if (player.x != this.x) {
                if (player.x > this.x) {
                    this.moves.push("right");
                } else {
                    this.moves.push("left");
                    continue;
                }
            }
        }
    }
}

export function addHound(x, y, health, ap, weapon) {
    enemies.push(new hound(x, y, health, ap, weapon));
}

var spritesheet = [];
var detailContainer = new PIXI.Container();

function mouseover(x, y) {
    app.stage.addChild(detailContainer);
    if (player.weapon.range >= distApartCoord(player, x, y)) {
        updateActionText("In Range, Click enemy to confirm attack");
    } else {
        updateActionText("Out of Range");
    }
}

function mouseout() {
    app.stage.removeChild(detailContainer);
    
    updateActionText("");
}

function createSpriteSheet() {
    spritesheet["idle"] = [new PIXI.Texture(houndssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh))];
}