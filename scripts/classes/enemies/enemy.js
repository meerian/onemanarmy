import { updateActionText, takeDamage, removeItem } from "../../pages/gamePage.js";

export class enemy extends gameObject {
    constructor(name, x, y, health, ap, sprite, weapon, xNudge = 0, yNudge = 0) {
        super(x, y, health, ap, sprite, weapon, xNudge, yNudge);
        this.name = name;
        this.sprite.interactive = true;
        this.moves = [];

        //Draw text
        this.helpertext = new PIXI.Text(this.name + " (" + this.health + "HP)\nRange:" + this.weapon.range + " Dmg:" + this.weapon.mindmg + "-" + this.weapon.maxdmg + "\nAP:" + this.ap, textStyleHelper);
        this.helpertext.x = realPositionX(this.x) + 10;
        this.helpertext.y = realPositionY(this.y) + 10;
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
            mouseout(this.x, this.y);
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
            updateActionText("");
            removeItem(this);
            enemies.splice(enemies.indexOf(this), 1);
            app.stage.removeChild(detailContainer);
        } else {
        this.helpertext.text = this.name + " (" + this.health + "HP)\nRange:" + this.weapon.range + " Dmg:" + this.weapon.mindmg + "-" + this.weapon.maxdmg + "\nAP:" + this.ap;
        }
    }
}

function mouseover(x, y) {
    let enemy = findEnemy(x, y);
    detailContainer.addChild(enemy.helpertext)
    if (player.weapon.bullets == 0) {
        updateActionText("Out of ammo, reload!");
    } else if (player.weapon.range >= distApartObj(player, enemy)) {
        updateActionText("In Range, Click enemy to confirm attack");
    } else {
        updateActionText("Out of Range");
    }
}

function mouseout(x, y) {
    let enemy = findEnemy(x, y);
    detailContainer.removeChild(enemy.helpertext)
    updateActionText("");
}
