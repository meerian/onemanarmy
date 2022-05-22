class user extends gameObject {
    constructor(x, y, health, ap, weapon) {
        super(x, y, health, ap, new PIXI.Sprite(PIXI.Texture.from("../images/user.png")), weapon);
    }

    updateLocation() {
    }

    takeDamage() {
    }

    getLocation() {
        var curLocation = [this.x, this.y];
        return curLocation;
    }
}

// -------------------------------------------------------------------------------

//Public methods
export function addUser(x, y, health, ap, weapon) {
    player = new user(x, y, health, ap, weapon);
}

export function drawUser(container) {
    player.draw(container);
}

export function emptyUser() {
    player = 0;
}