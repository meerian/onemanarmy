import { gamePage } from "./pages/gamePage.js";
import { addUser } from "./classes/user.js";

let page = new gamePage();
page.init();
addUser(1, 2, 10, 3, new PIXI.Sprite(PIXI.Texture.from("../images/user.png")), 0);
player.draw(app.stage);
console.log(player.ap);