
class removeHaddW extends upgrade {
    constructor() {
        let flavourtext = "Removes 2 hounds \n Adds 1 warrior"
        super("Modification", "Enemy Swap", flavourtext, "", new PIXI.Texture.from('images/placeholder.png'));
    }

    apply() {
        const index = enemySpawnList.indexOf("hound");
        if (index > -1) {
            enemySpawnList.splice(index, 2);
          }
          enemySpawnList.push("warrior");
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

export function parseMod(mod) {
    switch (mod) {
        case 1:
            return new removeHaddW();
        case 2:
            return new sharperClaws();
    }
}
