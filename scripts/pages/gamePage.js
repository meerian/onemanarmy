export class gamePage extends page {
    constructor() {
        super(gameContainer);
    }

    createPage() {
        //Add grid
        let grid = new PIXI.Sprite(new PIXI.Texture.from('images/grid.png'));
        grid.x = xCentral;
        grid.y = yCentral;
        grid.anchor.set(0.5);
        grid.scale.set(3, 3);
        grid.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.container.addChild(grid);

       

        //Draw user section
        drawText(new PIXI.Text("Health", textStyle), xCentral - 250, yCentral + 150, this.container, true);
        let healthbar = new PIXI.Sprite(new PIXI.Texture.from('images/healthbar.png'));
        healthbar.x = xCentral - 278;
        healthbar.y = yCentral + 160;
        this.container.addChild(healthbar);
        drawText(new PIXI.Text("AP:", textStyle), xCentral - 150, yCentral + 150, this.container, true);
        drawText(new PIXI.Text(playerAP, textStyle), xCentral - 130, yCentral + 148, this.container, true);
    }
}

var gameContainer = new PIXI.Container();