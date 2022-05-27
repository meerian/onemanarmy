export class pistol extends weapon {
    constructor() {
        super("Pistol", 1 + playerVal.mindmgmodifier, Math.max(3 + playerVal.maxdmgmodifier, 1), 3, 3 + playerVal.rangemodifier);
    }
}