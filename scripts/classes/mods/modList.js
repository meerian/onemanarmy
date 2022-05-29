
class removeHaddW extends upgrade {
    constructor() {
        let flavourtext = "Remove up to 2 hounds \n\n Add 1 warrior"
        super("Modification", "Enemy Swap", flavourtext, "", new PIXI.Texture.from('images/placeholder.png'));
    }

    apply() {
        const index = curSpawn.indexOf("hound");
        if (index > -1) {
            curSpawn.splice(index, 2);
          }
          curSpawn.push("warrior");
    }
}

class sharperClaws extends upgrade {
    constructor() {
        let flavourtext = "All hounds do \n +1 MAX damage"
        super("Modification", "Sharper Claws", flavourtext, "", new PIXI.Texture.from('images/placeholder.png'));
    }

    apply() {
        enemyVal.sharperclaw++;
    }
}

class addH extends upgrade {
    constructor() {
        let flavourtext = "Add one hound"
        super("Modification", "Add Enemy", flavourtext, "", new PIXI.Texture.from('images/placeholder.png'));
    }

    apply() {
        curSpawn.push("hound");
    }
}

export function parseMod(mod) {
    switch (mod) {
        case 1:
            return new removeHaddW();
        case 2:
            return new sharperClaws();
        case 3:
            return new addH();
    }
}
