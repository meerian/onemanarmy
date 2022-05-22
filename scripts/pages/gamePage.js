export class gamePage extends page {
    constructor() {
        super(gameContainer);
    }

    createPage() {
        //Add grid
        let grid = new PIXI.Sprite(new PIXI.Texture.from('images/grid.png'));
        grid.x = app.renderer.width / 2;
        grid.y = app.renderer.height / 2;
        grid.anchor.set(0.5);
        grid.scale.set(3, 3);
        grid.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.container.addChild(grid);

        drawText(new PIXI.Text("My name is hello", textStyle), 100, 100, this.container, true);

        //Draw health
        let healthbar = new PIXI.Sprite(new PIXI.Texture.from('images/healthbar.png'));
        healthbar.x = app.renderer.width / 5;
        healthbar.y = 5 * app.renderer.height / 6;
        this.container.addChild(healthbar);
    }
}

var gameContainer = new PIXI.Container();