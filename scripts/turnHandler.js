import { playerTurn } from "./classes/user.js";
import { updateTurnText, levelEnd } from "./pages/gamePage.js";
import { gamePage } from "./pages/gamePage.js";

export function nextTurn() {
    if (enemies.length == enemyDefeated) {
        if (flag) {
            levelEnd();
            flag = false;
        }
        return;
    }
    if (isPlayerturn) {
        updateTurnText();
        playerTurn();
    }
    else {
        if (enemyTurnCounter == enemies.length) {
            isPlayerturn = true;
            playerVal.firstturnNoDmg = false;
            resetenemyTurn();
            nextTurn();
            return;
        }
        updateTurnText();
        enemies[enemyTurnCounter].nextMove();
    }
}

var flag = true;

export function startLevel() {
    flag = true;
    let page = new gamePage();
    page.init();
    //nextTurn();
}