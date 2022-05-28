class longbarrel extends upgrade {
    constructor() {
        let flavourtext = "Increases your range\n by +1\n but decreases maxdmg \nby -1 (minimum 1)"
        let shortdesc = "+1 to range\n -1 to maxdmg"
        super("Passive", "Long Barrel", flavourtext, shortdesc, new PIXI.Texture(upgradessheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh)));
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
    }
}

export function applyUpgrade(upgrade) {
    switch (upgrade.name) {
        case "Long Barrel":
            playerVal.maxdmgmodifier--;
            playerVal.rangemodifier++;
            playerInventory.push(upgrade);
            return;
        case "Machinegun":
            playerVal.weapon = upgrade;
            return;
        case "Assault Rifle":
            playerVal.weapon = upgrade;
            return;
    }
}

//Weapons: (name, mindmg, maxdmg, clip, range, texture, critchance)

export class pistol extends weapon {
    constructor() {
        let flavourtext = "Starting weapon."
        super("Pistol", 5, 5, 3, 3, flavourtext, new PIXI.Texture.from('images/placeholder.png'));
    }
}

class machinegun extends weapon {
    constructor() {
        let flavourtext = "Deals 1-2 dmg\n Clipsize: 10 range:2"
        super("Machinegun", 1, 2, 10, 2, flavourtext, new PIXI.Texture(upgradessheet, new PIXI.Rectangle(1 * rw, 0 * rh, rw, rh)));
    }
}

class assaultrifle extends weapon {
    constructor() {
        let flavourtext = "Deals 2-3 dmg\n Clipsize: 3 range:4 \n\nEach shot has a \n20% chance to crit \nfor double the damage"
        super("Assault Rifle", 2, 3, 3, 4, flavourtext, new PIXI.Texture(upgradessheet, new PIXI.Rectangle(2 * rw, 0 * rh, rw, rh)), 0.2);
    }
}