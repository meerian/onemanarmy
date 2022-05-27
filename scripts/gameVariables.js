//User reference and functions
var gamelevel = 1;
var player = 0;
const playerVal = {
    maxap: 3,
    ap: 3,
    maxhealth: 10,
    health: 10,
    ammo: 3,
    rangemodifier: 0,
    mindmgmodifier: 0,
    maxdmgmodifier: 0,
    clipmodifier: 0,
    weapon: 0,
}
var playerInventory = [];

var enemies = [];
var enemyTurnCounter = 0;
var enemyDefeated = 0;

function resetenemyTurn() {
    enemyTurnCounter = 0;
}

function findEnemy(x, y) {
    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].sprite.x == x && enemies[i].sprite.y == y) {
            return enemies[i];
        }
    }
    console.log("none found");
}

//For Desktop
document.getElementById('myCanvas').addEventListener("keydown", keyDownHandler, false);
document.getElementById('myCanvas').setAttribute("tabindex", 0);
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d") {
        e.preventDefault();
        player.displayMove("right");
    }
    if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a") {
        e.preventDefault();
        player.displayMove("left");
    }
    if (e.key == "up" || e.key == "ArrowUp" || e.key == "w") {
        e.preventDefault();
        player.displayMove("up");
    }
    if (e.key == "down" || e.key == "ArrowDown" || e.key == "s") {
        e.preventDefault();
        player.displayMove("down");
    }
}

//Turn handling
var isPlayerturn = true;