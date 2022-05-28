import { gamePage } from "./pages/gamePage.js";
import { nextTurn } from "./turnHandler.js";

let page = new gamePage();
page.init();
nextTurn();