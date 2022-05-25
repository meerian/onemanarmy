import { playerTurn } from "./classes/user.js";

export function nextTurn() {
    if (player.sprite.playing) {
        setTimeout(function () { nextTurn(); }, 100);
        return;
    }
    if (isPlayerturn) {
        playerTurn(); 
    }
    else {
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].nextMove();
        }
        isPlayerturn = true;
        nextTurn();
    }
}