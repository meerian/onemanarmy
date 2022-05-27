import { playerTurn } from "./classes/user.js";
import { updateTurnText, levelEnd } from "./pages/gamePage.js";
import { gamePage } from "./pages/gamePage.js";

export function nextTurn() {
    if (enemies.length == 0) {
        levelEnd();
    }
    if (isPlayerturn) {
        updateTurnText();
        playerTurn();
    }
    else {
        if (enemyTurnCounter == enemies.length) {
            isPlayerturn = true;
            resetenemyTurn();
            nextTurn();
            return;
        }
        updateTurnText();
        enemies[enemyTurnCounter].nextMove();
    }
}

export function startLevel() {
    let page = new gamePage();
    page.init();
    nextTurn();
}