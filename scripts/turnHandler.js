import { playerTurn } from "./classes/user.js";
import { updateTurnText } from "./pages/gamePage.js";

export function nextTurn() {
    if (player.sprite.playing) {
        setTimeout(function () { nextTurn(); }, 100);
        return;
    }
    if (isPlayerturn) {
        updateTurnText();
        playerTurn(); 
    }
    else {
        updateTurnText();
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].nextMove();
        }
        isPlayerturn = true;
        nextTurn();
    }
}