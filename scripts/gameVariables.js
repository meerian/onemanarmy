//User reference and functions
var gamelevel = 1;
var player = 0;
var playerVal = {
    maxap: 3,
    ap: 3,
    maxhealth: 10,
    health: 10,
    ammo: 3,
    rangemodifier: 0,
    mindmgmodifier: 0,
    maxdmgmodifier: 0,
    clipmodifier: 0,
    critmodifier: 0,
    weapon: 0,
    nextIsCrit: false,
    nextNoDmg: false,
    nextExpendAll: false,
    guncalibrated: false,
    firstturnNoDmg: false,
}
var playerInventory = [];
//Turn handling
var isPlayerturn = false;

var enemySpawnList = {
    1: ["hound", "hound"],
    2: ["warrior"],
    3: ["centaur"],
    4: [],
    5: ["sniper"],
    6: ["slime"],
    7: ["centaur"],
    8: [],
}

var curSpawn = [...enemySpawnList[1]];

function removeEnemy() {
    if (curSpawn.indexOf("hound") != -1) {
        let index = curSpawn.indexOf("hound");
        curSpawn.splice(index, 1);
    } else if (curSpawn.indexOf("warrior") != -1) {
        let index = curSpawn.indexOf("warrior");
        curSpawn.splice(index, 1);
    }
}

//index = current Y --> mapped to next Y
const enemySpawnCoord = [-1, 4, 3, 1, 0];
var enemies = [];
var enemyTurnCounter = 0;
var enemyDefeated = 0;
var enemyVal = {
    sharperclaw: 0,
    extrabullet: 0,
    caltrops: 0,
    unitrange: 0,
    extramovement: 0,
    ogrechange: false,
}

function resetAll() {
    gamelevel = 1;
    playerVal = {
        maxap: 3,
        ap: 3,
        maxhealth: 10,
        health: 10,
        ammo: 3,
        rangemodifier: 0,
        mindmgmodifier: 0,
        maxdmgmodifier: 0,
        clipmodifier: 0,
        critmodifier: 0,
        weapon: 0,
        nextIsCrit: false,
        nextNoDmg: false,
        nextExpendAll: false,
        guncalibrated: false,
        firstturnNoDmg: false,
    }
    playerInventory = [];
    isPlayerturn = false;
    curSpawn = [...enemySpawnList[1]];
    enemyVal = {
        sharperclaw: 0,
        extrabullet: 0,
        caltrops: 0,
        unitrange: 0,
        extramovement: 0,
        ogrechange: false,
    }
    enemies = [];
    enemyTurnCounter = 0;
    enemyDefeated = 0;
    while (bgContainer.children[1]) {
        bgContainer.removeChild(bgContainer.children[1]);
    }
}


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

function findEnemyAlive(x, y) {
    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].sprite.x == x && enemies[i].sprite.y == y && enemies[i].isAlive) {
            return enemies[i];
        }
    }
    console.log("none found");
}

function checkAround(arr, x, y, dir) {
    switch (dir) {
        case "x":
            for (let i = 0; i < enemies.length; i++) {
                if (enemies[i].y == y && enemies[i].isAlive && Math.abs(enemies[i].x - x) == 1) {
                    arr.push(enemies[i]);
                }
            }
            break;
        case "y":
            for (let i = 0; i < enemies.length; i++) {
                if (enemies[i].x == x && enemies[i].isAlive && Math.abs(enemies[i].y - y) == 1) {
                    arr.push(enemies[i]);
                }
            }
            break;
    }
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
