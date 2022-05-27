import { gamePage } from "./pages/gamePage.js";
import { roundEndPage } from "./pages/roundEndPage.js";
import { nextTurn } from "./turnHandler.js";

let page = new gamePage();
//let page = new roundEndPage();
page.init();
nextTurn();