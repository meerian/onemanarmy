import { gamePage } from "./pages/gamePage.js";
import { addUser } from "./classes/user.js";

addUser(1, 2, 10, 3, new PIXI.Sprite(PIXI.Texture.from("../images/user.png")), 0);
let page = new gamePage();
page.init();
player.draw(app.stage);
