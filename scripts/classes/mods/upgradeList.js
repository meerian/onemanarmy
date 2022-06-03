import { showString } from "../../pages/gamePage.js"

//Passives

class longbarrel extends upgrade {
    constructor() {
        let flavourtext = "Increases your range\n by +1\n Decreases maxdmg\n by -1 \n(To a minimum of 1)"
        let shortdesc = "+1 to range\n -1 to maxdmg"
        super("Passive", "Long Barrel", flavourtext, shortdesc, new PIXI.Texture(upgradessheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh)));
    }

    apply() {
        playerVal.maxdmgmodifier--;
        playerVal.rangemodifier++;
        playerVal.weapon.updateRange(1);
        playerVal.weapon.updateDmg(0, -1);
        playerInventory.push(this);
    }
}

class shortbarrel extends upgrade {
    constructor() {
        let flavourtext = "Increases your mindmg\n by +1\n Decreases your range\n by -1 \n(To a minimum of 1)"
        let shortdesc = "+1 to mindmg\n -1 to range"
        super("Passive", "Shorter Barrel", flavourtext, shortdesc, new PIXI.Texture(upgradessheet, new PIXI.Rectangle(9 * rw, 0 * rh, rw, rh)));
    }

    apply() {
        playerVal.mindmgmodifier++;
        playerVal.rangemodifier--;
        playerVal.weapon.updateRange(-1);
        playerVal.weapon.updateDmg(1, 0);
        playerInventory.push(this);
    }
}


class extendedmag extends upgrade {
    constructor() {
        let flavourtext = "Increases your \nclipsize by +1"
        let shortdesc = "+1 to clipsize"
        super("Passive", "Extended Mag", flavourtext, shortdesc, new PIXI.Texture(upgradessheet, new PIXI.Rectangle(6 * rw, 0 * rh, rw, rh)));
    }

    apply() {
        playerVal.clipmodifier++;
        playerVal.weapon.updateAmmo(1);
        playerInventory.push(this);
    }
}

class sharperbullet extends upgrade {
    constructor() {
        let flavourtext = "Your bullets have \nextra 15% chance \n to crit for \ndouble damage"
        let shortdesc = "+15% critchance"
        super("Passive", "Sharper \n Bullets", flavourtext, shortdesc, new PIXI.Texture(upgradessheet, new PIXI.Rectangle(7 * rw, 0 * rh, rw, rh)));
    }

    apply() {
        playerVal.critmodifier += 0.15;
        playerVal.weapon.updateCchance(0.15);
        playerInventory.push(this);
    }
}

class meat extends upgrade {
    constructor() {
        let flavourtext = "Increases your HP\n by +5"
        let shortdesc = "+5 to HP"
        super("Passive", "Meat", flavourtext, shortdesc, new PIXI.Texture(upgradessheet, new PIXI.Rectangle(1 * rw, 1 * rh, rw, rh)));
    }

    apply() {
        playerVal.maxhealth += 5;
        playerInventory.push(this);
    }
}

class caltrops extends upgrade {
    constructor() {
        let flavourtext = "At the start of\n battle, deal one \n damage to each enemy"
        let shortdesc = "Deal 1 DMG at start of battle"
        super("Passive", "Caltrops", flavourtext, shortdesc, new PIXI.Texture(upgradessheet, new PIXI.Rectangle(2 * rw, 1 * rh, rw, rh)));
    }

    apply() {
        enemyVal.caltrops++;
        playerInventory.push(this);
    }
}

class gunpowder extends upgrade {
    constructor() {
        let flavourtext = "Increases your max\n damage by 1 \n Decrease your min \n damage by 1"
        let shortdesc = "+1 to max damage \n -1 to min damage"
        super("Passive", "Gunpowder", flavourtext, shortdesc, new PIXI.Texture(upgradessheet, new PIXI.Rectangle(5 * rw, 1 * rh, rw, rh)));
    }

    apply() {
        playerVal.maxdmgmodifier++;
        playerVal.mindmgmodifier--;
        player.weapon.updateDmg(-1, 1);
        playerInventory.push(this);
    }
}

class caffeinepill extends upgrade {
    constructor() {
        let flavourtext = "Increases your AP\n by 1 \n Decrease your range \nby 1"
        let shortdesc = "+1 to AP \n -1 to range"
        super("Passive", "Caffeine Pill", flavourtext, shortdesc, new PIXI.Texture(upgradessheet, new PIXI.Rectangle(6 * rw, 1 * rh, rw, rh)));
    }

    apply() {
        playerVal.maxap++;
        playerVal.rangemodifier--;
        player.weapon.updateRange(-1);
        playerInventory.push(this);
    }
}

//Actives

class scope extends upgrade {
    constructor() {
        let flavourtext = "Once per battle\n on use, your next\n bullet will be a \nguaranteed crit \n(for double damage)"
        super("Active", "Scope", flavourtext, "", new PIXI.Texture(upgradessheet, new PIXI.Rectangle(4 * rw, 0 * rh, rw, rh)));
        this.maxCharge = 1;
        this.charge = this.maxCharge;
        this.shortdesc = `next shot is a crit\nCharge:${this.charge}/${this.maxCharge}`;
    }

    reload() {
        this.charge = this.maxCharge;
        this.shortdesc = `next shot is a crit\nCharge:${this.charge}/${this.maxCharge}`;
    }

    use() {
        if (this.charge) {
            playerVal.nextIsCrit = true;
            this.charge--;
            this.shortdesc = `next shot is a crit\nCharge:${this.charge}/${this.maxCharge}`;
            showString(`Scope used!`);
        } else {
            showString(`No more charges!`);
        }
    }

    apply() {
        playerInventory.push(this);
        return;
    }
}

class extraclip extends upgrade {
    constructor() {
        let flavourtext = "Once per battle\n on use, reloads\n your gun for \nfree"
        super("Active", "Extra Clip", flavourtext, "", new PIXI.Texture(upgradessheet, new PIXI.Rectangle(5 * rw, 0 * rh, rw, rh)));
        this.maxCharge = 1;
        this.charge = this.maxCharge;
        this.shortdesc = `Reloads your gun\nCharge:${this.charge}/${this.maxCharge}`;
    }

    reload() {
        this.charge = this.maxCharge;
        this.shortdesc = `Reloads your gun\nCharge:${this.charge}/${this.maxCharge}`;
    }

    use() {
        if (this.charge) {
            if (player.weapon.bullets == player.weapon.clip) {
                showString("Ammo Full!");
                return;
            }
            player.reload(true);
            this.charge--;
            this.shortdesc = `Reloads your gun\nCharge:${this.charge}/${this.maxCharge}`;
        } else {
            showString(`No more charges!`);
        }
    }

    apply() {
        playerInventory.push(this);
        return;
    }
}

class protectioncharm extends upgrade {
    constructor() {
        let flavourtext = "Once per battle on \nuse, negate next \ndamage taken "
        super("Active", "Protection \nCharm", flavourtext, "", new PIXI.Texture(upgradessheet, new PIXI.Rectangle(8 * rw, 0 * rh, rw, rh)));
        this.maxCharge = 1;
        this.charge = this.maxCharge;
        this.shortdesc = `Negate next damage\nCharge:${this.charge}/${this.maxCharge}`;
    }

    reload() {
        this.charge = this.maxCharge;
        this.shortdesc = `Negate next damage\nCharge:${this.charge}/${this.maxCharge}`;
    }

    use() {
        if (this.charge) {
            playerVal.nextNoDmg = true;
            this.charge--;
            this.shortdesc = `Negate next damage\nCharge:${this.charge}/${this.maxCharge}`;
            showString(`Protection Charm used!`);
        } else {
            showString(`No more charges!`);
        }
    }

    apply() {
        playerInventory.push(this);
        return;
    }
}

class secondwind extends upgrade {
    constructor() {
        let flavourtext = "On use, gain  1 AP.\n (2 charges \n per battle)"
        super("Active", "Second Wind", flavourtext, "", new PIXI.Texture(upgradessheet, new PIXI.Rectangle(3 * rw, 1 * rh, rw, rh)));
        this.maxCharge = 2;
        this.charge = this.maxCharge;
        this.shortdesc = `Gain 1 AP\nCharge:${this.charge}/${this.maxCharge}`;
    }

    reload() {
        this.charge = this.maxCharge;
        this.shortdesc = `Gain 1 AP\nCharge:${this.charge}/${this.maxCharge}`;
    }

    use() {
        if (this.charge) {
            this.charge--;
            playerVal.ap++;
            player.updateAP();
            this.shortdesc = `Gain 1 AP\nCharge:${this.charge}/${this.maxCharge}`;
            showString(`Second Wind used!`);
        } else {
            showString(`No more charges!`);
        }
    }

    apply() {
        playerInventory.push(this);
        return;
    }
}

export function parseUpgrade(upgrade) {
    switch (upgrade) {
        case 1:
            return new sniperrifle();
        case 2:
            return new machinegun();
        case 3:
            return new assaultrifle();
        case 4:
            return new smg();
        case 5:
            return new shotgun();
        case 6:
            return new extraclip();
        case 7:
            return new extendedmag();
        case 8:
            return new protectioncharm();
        case 9:
            return new shortbarrel();
        case 10:
            return new sharperbullet();
        case 11:
            return new longbarrel();
        case 12:
            return new meat();
        case 13:
            return new caltrops();
        case 14:
            return new secondwind();
        case 15:
            return new scope();
        case 16:
            return new gunpowder();
        case 17:
            return new caffeinepill();
    }
}

export function checkValidity(upgrade) {
    switch (upgrade) {
        case 1:
            return playerVal.weapon.name != "Sniper Rifle";
        case 2:
            return playerVal.weapon.name != "Machinegun";
        case 3:
            return playerVal.weapon.name != "Assault Rifle";
        case 4:
            return playerVal.weapon.name != "SMG";
        case 5:
            return playerVal.weapon.name != "Shotgun";
        default:
            return true;
    }

}

//Weapons: (name, mindmg, maxdmg, clip, range, texture, critchance)

export class pistol extends weapon {
    constructor() {
        let flavourtext = "Starting weapon."
        super("Pistol", 5, 5, 3, 3, flavourtext, new PIXI.Texture.from('images/placeholder.png'), playerVal.critmodifier);
        this.update();
    }

    apply() {
        playerVal.weapon = this;
    }
}

class machinegun extends weapon {
    constructor() {
        let flavourtext = "Deals 1-3 dmg\n Clipsize: 10 \nRange:2"
        super("Machinegun", 1, 3, 10, 2, flavourtext, new PIXI.Texture(upgradessheet, new PIXI.Rectangle(1 * rw, 0 * rh, rw, rh)));
        this.update();
    }

    apply() {
        playerVal.weapon = this;
    }
}

class assaultrifle extends weapon {
    constructor() {
        let flavourtext = "Deals 2-4 dmg\n Clipsize: 3 \nRange:4 \n\nEach shot has a \n20% chance to crit \nfor double the damage"
        super("Assault Rifle", 2, 3, 3, 4, flavourtext, new PIXI.Texture(upgradessheet, new PIXI.Rectangle(2 * rw, 0 * rh, rw, rh)), 0.2);
        this.update();
    }

    apply() {
        playerVal.weapon = this;
    }
}

class smg extends weapon {
    constructor() {
        let flavourtext = "Deals 1-2 dmg\n Clipsize: 4 \nRange:3 \n\nEach shot has a \n30% change to cost 0 AP"
        super("SMG", 1, 2, 4, 3, flavourtext, new PIXI.Texture(upgradessheet, new PIXI.Rectangle(3 * rw, 0 * rh, rw, rh)));
        this.update();
    }

    apply() {
        playerVal.weapon = this;
    }
}

class sniperrifle extends weapon {
    constructor() {
        let flavourtext = "Deals 3-5 dmg\n Clipsize: 1 \nRange:6 \n\nGain a scope that \non use, your next\n bullet will be a \nguaranteed crit \n(for double damage)\n Costs 1 AP"
        super("Sniper Rifle", 3, 5, 1, 6, flavourtext, new PIXI.Texture(upgradessheet, new PIXI.Rectangle(0 * rw, 1 * rh, rw, rh)));
        this.update();
        this.shortdesc = "next shot is a crit\nCosts 1 AP";
    }

    apply() {
        playerVal.weapon = this;
        playerInventory.push(this);
    }

    use() {
        playerVal.nextIsCrit = true;
        playerVal.ap--;
        player.updateAP();
        showString(`Sniper scope used!`);
    }
}

class shotgun extends weapon {
    constructor() {
        let flavourtext = "Deals 3-5 dmg\n Clipsize: 3 \nRange:1 \n\nEach shot hits \nadjacent enemies as \nwell"
        super("Shotgun", 3, 5, 3, 1, flavourtext, new PIXI.Texture(upgradessheet, new PIXI.Rectangle(4 * rw, 1 * rh, rw, rh)));
        this.update();
    }

    apply() {
        playerVal.weapon = this;
    }
}