class longbarrel extends upgrade {
    constructor() {
        let flavourtext = "Increases your range\n by +1\n but decreases maxdmg \nby -1 (minimum 1)"
        let shortdesc = "+1 to range\n -1 to maxdmg"
        super("Passive", "Long Barrel", flavourtext, shortdesc, new PIXI.Texture(upgradessheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh)));
    }

    apply() {
        playerVal.maxdmgmodifier--;
        playerVal.rangemodifier++;
        playerInventory.push(this);
    }
}

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
            return new longbarrel();
        case 2:
            return new machinegun();
        case 3:
            return new assaultrifle();
        case 4:
            return new smg();
        case 5:
            return new scope();
    }
}

//Weapons: (name, mindmg, maxdmg, clip, range, texture, critchance)

export class pistol extends weapon {
    constructor() {
        let flavourtext = "Starting weapon."
        super("Pistol", 5, 5, 3, 3, flavourtext, new PIXI.Texture.from('images/placeholder.png'));
    }

    apply() {
        playerVal.weapon = this;
    }
}

class machinegun extends weapon {
    constructor() {
        let flavourtext = "Deals 1-3 dmg\n Clipsize: 10 \nRange:2"
        super("Machinegun", 1, 3, 10, 2, flavourtext, new PIXI.Texture(upgradessheet, new PIXI.Rectangle(1 * rw, 0 * rh, rw, rh)));
    }

    apply() {
        playerVal.weapon = this;
    }
}

class assaultrifle extends weapon {
    constructor() {
        let flavourtext = "Deals 2-4 dmg\n Clipsize: 3 \nRange:4 \n\nEach shot has a \n20% chance to crit \nfor double the damage"
        super("Assault Rifle", 2, 3, 3, 4, flavourtext, new PIXI.Texture(upgradessheet, new PIXI.Rectangle(2 * rw, 0 * rh, rw, rh)), 0.2);
    }

    apply() {
        playerVal.weapon = this;
    }
}

class smg extends weapon {
    constructor() {
        let flavourtext = "Deals 1-3 dmg\n Clipsize: 4 \nRange:3 \n\nEach shot has a \n30% change to cost 0 AP"
        super("SMG", 1, 3, 4, 3, flavourtext, new PIXI.Texture(upgradessheet, new PIXI.Rectangle(3 * rw, 0 * rh, rw, rh)));
    }

    apply() {
        playerVal.weapon = this;
    }
}