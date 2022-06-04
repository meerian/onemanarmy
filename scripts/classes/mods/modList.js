
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

class addH extends upgrade {
    constructor() {
        let flavourtext = "Add one hound"
        super("Modification", "Add Enemy", flavourtext, "", new PIXI.Texture(modssheet, new PIXI.Rectangle(1 * rw, 0 * rh, rw, rh)));
    }

    apply() {
        curSpawn.push("hound");
    }
}

class changeHtoW extends upgrade {
    constructor() {
        let flavourtext = "Turn all current hounds \n into warriors"
        super("Modification", "Enemy Swap", flavourtext, "", new PIXI.Texture(modssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh)));
    }

    apply() {
        while (curSpawn.indexOf("hound") != -1) {
            let index = curSpawn.indexOf("hound");
            curSpawn.splice(index, 1);
            curSpawn.push("warrior");
        }
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

class removeWaddC extends upgrade {
    constructor() {
        let flavourtext = "Remove up to 1 warrior \n Add 1 centaur"
        super("Modification", "Enemy Swap", flavourtext, "", new PIXI.Texture(modssheet, new PIXI.Rectangle(0 * rw, 0 * rh, rw, rh)));
    }

    apply() {
        let index = curSpawn.indexOf("warrior");
        if (index > -1) {
            curSpawn.splice(index, 1);
        }
        curSpawn.push("centaur");
    }
}

export function parseMod(mod) {
    switch (mod) {
        case 1:
            return new removeHaddW();
        case 2:
            return new sharperTeeth();
        case 3:
            return new addH();
        case 4:
            return new extrabullet();
        case 5:
            return new changeHtoW();
        case 6:
            return new extrarange();
        case 7:
            return new removeWaddC();
    }
}
