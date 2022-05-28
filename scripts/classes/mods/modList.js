
class removeHaddW extends upgrade {
    constructor() {
        let flavourtext = "Removes 2 hounds \n Adds 1 warrior"
        super("Modification", "Enemy Swap", flavourtext, "", new PIXI.Texture.from('images/placeholder.png'));
    }

    swap() {
        const index = enemySpawnList.indexOf("hound");
        if (index > -1) {
            enemySpawnList.splice(index, 2);
          }
          enemySpawnList.push("warrior");
    }
}

export function parseMod(mod) {
    switch (mod) {
        case 1:
            return new removeHaddW();
    }
}

export function applyMod(mod) {
    switch (mod.name) {
        case "Enemy Swap":
            mod.swap();
            return;
    }
}