export class enemy extends gameObject {
    constructor(x, y, health, ap, sprite, weapon, xNudge = 0, yNudge = 0) {
        super(x, y, health, ap, sprite, weapon, xNudge,yNudge);
        this.sprite.interactive = true;
        this.moves = [];
    }
}