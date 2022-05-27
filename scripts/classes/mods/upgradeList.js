class scope extends upgrade {
    constructor() {
        let flavourtext = "Increases your range\n by +1\n but decreases maxdmg \nby -1 (minimum 1)"
        super("Passive", "Scope", flavourtext);
    }
}

export function parseUpgrade(upgrade) {
    switch (upgrade) {
        case 1:
            return new scope();
    }
}

export function applyUpgrade(upgrade) {
    switch (upgrade) {
        case "Scope":
            playerVal.maxdmgmodifier--;
            playerVal.rangemodifier++;
            return;
    }
}