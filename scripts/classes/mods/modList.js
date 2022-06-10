
class removeHaddW extends upgrade {
    constructor() {
        let flavourtext = "Remove up to 2 hounds \n Add 1 warrior"
        super("Modification", "Enemy Swap", flavourtext, "", new PIXI.Texture(modssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh)));
    }

    apply() {
        let index = curSpawn.indexOf("hound");
        if (index > -1) {
            curSpawn.splice(index, 1);
        }
        index = curSpawn.indexOf("hound");
        if (index > -1) {
            curSpawn.splice(index, 1);
        }
        curSpawn.push("warrior");
    }
}

class sharperTeeth extends upgrade {
    constructor() {
        let flavourtext = "All hounds do \n +1 MAX damage"
        super("Modification", "Sharper Teeth", flavourtext, "", new PIXI.Texture(modssheet, new PIXI.Rectangle(2 * rw, 0 * rh, rw, rh)));
    }

    apply() {
        enemyVal.sharperclaw++;
    }
}

class extrabullet extends upgrade {
    constructor() {
        let flavourtext = "All enemy snipers\n gain +1 bullet \n to clip"
        super("Modification", "Extra Bullet", flavourtext, "", new PIXI.Texture(modssheet, new PIXI.Rectangle(3 * rw, 0 * rh, rw, rh)));
    }

    apply() {
        enemyVal.extrabullet++;
    }
}

class extramovement extends upgrade {
    constructor() {
        let flavourtext = "All melee enemies \n gain +1 AP"
        super("Modification", "Extra \n Movement", flavourtext, "", new PIXI.Texture(modssheet, new PIXI.Rectangle(5 * rw, 0 * rh, rw, rh)));
    }

    apply() {
        enemyVal.extramovement++;
    }
}

class addH extends upgrade {
    constructor() {
        let flavourtext = "Add a hound"
        super("Modification", "Enemy Swap", flavourtext, "", new PIXI.Texture(modssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh)));
    }

    apply() {
        curSpawn.push("hound");
    }
}

class removeWaddO extends upgrade {
    constructor() {
        let flavourtext = "Remove all current \n warriors \n Add an ogre"
        super("Modification", "Enemy Swap", flavourtext, "", new PIXI.Texture(modssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh)));
    }

    apply() {
        while (curSpawn.indexOf("warrior") != -1) {
            let index = curSpawn.indexOf("warrior");
            curSpawn.splice(index, 1);
        }
        curSpawn.push("ogre")
    }
}

class extrarange extends upgrade {
    constructor() {
        let flavourtext = "All enemy ranged \n units gain +1 \n to range"
        super("Modification", "Extra Range", flavourtext, "", new PIXI.Texture(modssheet, new PIXI.Rectangle(4 * rw, 0 * rh, rw, rh)));
    }

    apply() {
        enemyVal.unitrange++;
    }
}

class removeWaddS extends upgrade {
    constructor() {
        let flavourtext = "Remove up to 1 warrior \n Add 1 slime"
        super("Modification", "Enemy Swap", flavourtext, "", new PIXI.Texture(modssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh)));
    }

    apply() {
        let index = curSpawn.indexOf("warrior");
        if (index > -1) {
            curSpawn.splice(index, 1);
        }
        curSpawn.push("slime");
    }
}

class ogrechange extends upgrade {
    constructor() {
        let flavourtext = "Ogres no longer take\n 2 turns to attack \n DMG of ogres is halved"
        super("Modification", "Shrink Ray", flavourtext, "", new PIXI.Texture(modssheet, new PIXI.Rectangle(6 * rw, 0 * rh, rw, rh)));
    }

    apply() {
        enemyVal.ogrechange = true;
    }
}

class addogre extends upgrade {
    constructor() {
        let flavourtext = "The ogre is\n here!"
        super("Modification", "Ogre!", flavourtext, "", new PIXI.Texture(modssheet, new PIXI.Rectangle(7 * rw, 0 * rh, rw, rh)));
    }

    apply() {
        curSpawn.unshift("ogre");
    }
}

class adddragon extends upgrade {
    constructor() {
        let flavourtext = "The dragon is\n coming!"
        super("Modification", "Dragon!", flavourtext, "", new PIXI.Texture(modssheet, new PIXI.Rectangle(8 * rw, 0 * rh, rw, rh)));
    }

    apply() {
        curSpawn = ["dragon"];
    }
}

export function parseMod(mod) {
    switch (mod) {
        case 1:
            return new removeHaddW(); //base
        case 2:
            return new sharperTeeth(); //base
        case 3:
            return new extramovement(); //base
        case 4:
            return new addH(); //lvl 2: warrior
        case 5:
            return new removeWaddS(); //lvl 3: centaur
        case 6:
            return new extrarange(); //lvl 5: sniper
        case 7:
            return new ogrechange(); //lvl 5: sniper
        case 8:
            return new removeWaddO(); //lvl 6: slime
        case 9:
            return new extrabullet(); //lvl 7
        case -1:
            return new addogre(); //lvl 4: ogre
        case -2:
            return new adddragon(); //lvl 8: dragon
    }
}
