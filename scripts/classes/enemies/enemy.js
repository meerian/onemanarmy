import { updateActionText, takeDamage, removeItem } from "../../pages/gamePage.js";

export class enemy extends gameObject {
    constructor(x, y, health, ap, sprite, weapon, xNudge = 0, yNudge = 0) {
        super(x, y, health, ap, sprite, weapon, xNudge, yNudge);
        this.sprite.interactive = true;
        this.moves = [];

        //Draw text
        this.helpertext = new PIXI.Text("", textStyleHelper);
        drawText(this.helpertext, realPositionX(this.x) + 10, realPositionY(this.y) + 10, detailContainer);
        this.sprite.on("pointerdown", function (event) {
            let enemy = findEnemy(this.x, this.y);
            if (distApartObj(player, enemy) <= player.weapon.range && player.weapon.bullets > 0) {
                enemy.takeDamage(player.weapon.attack());
            }
        })
        this.sprite.on("mouseover", function (event) {
            mouseover(this.x, this.y);
        });

        this.sprite.on("mouseout", function (event) {
            mouseout();
        });
    }

    updateHelper() {
        this.helpertext.x = realPositionX(this.x) + 10;
        this.helpertext.y = realPositionY(this.y) + 10;
    }

    takeDamage(val) {
        player.attack();
        takeDamage(this, val);
        this.health -= val;
        if (this.health <= 0) {
            removeItem(this);
            enemies.splice(enemies.indexOf(this), 1);
            app.stage.removeChild(detailContainer);
        }
    }
}

var detailContainer = new PIXI.Container();

function mouseover(x, y) {
    app.stage.addChild(detailContainer);
    let enemy = findEnemy(x, y);
    if (player.weapon.bullets == 0) {
        updateActionText("Out of ammo, reload!");
    } else if (player.weapon.range >= distApartObj(player, enemy)) {
        updateActionText("In Range, Click enemy to confirm attack");
    } else {
        updateActionText("Out of Range");
    }
}

function mouseout() {
    app.stage.removeChild(detailContainer);

    updateActionText("");
}
