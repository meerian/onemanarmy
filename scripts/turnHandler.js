import { playerTurn } from "./classes/user.js";

export function nextTurn() {
    if (isPlayerturn) {
        playerTurn();
    }
}