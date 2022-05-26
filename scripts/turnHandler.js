import { playerTurn } from "./classes/user.js";
import { updateTurnText } from "./pages/gamePage.js";

export function nextTurn() {
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