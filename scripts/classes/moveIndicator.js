import { updateAP } from "../pages/gamePage.js";

export class moveIndicator {
    constructor(x, y, ap) {
        this.curX = x;
        this.curY = y;
        this.moves = [];
        this.movePointer = [];
        this.helper = 0;
        this.helpertext = 0;
        this.ap = ap;
        app.stage.addChild(moveContainer);
        mIndicator = this;
    }

    update(str) {
        if (this.moves.length > 0 && this.backCheck(str)) {
            this.removeHelper();
            this.moves.pop();
            moveContainer.removeChild(this.movePointer.pop());
            this.ap++;
            this.updateCoord(str);
            if (this.moves.length) {
                this.drawHelper();
            } 
        } else if (this.ap && this.borderCheck(str)) {
            this.removeHelper();
            let line = new PIXI.Graphics();
            line.position.set(this.curX, this.curY);
            line.lineStyle(1, 0x00FF2A);
            switch (str) {
                case "up":
                    line.lineTo(0, -48)
                    this.moves.push("up");
                    break;
                case "down":
                    line.lineTo(0, 48);
                    this.moves.push("down");
                    break;
                case "right":
                    line.lineTo(48, 0);
                    this.moves.push("right");
                    break;
                case "left":
                    line.lineTo(-48, 0);
                    this.moves.push("left");
                    break;
            }
            this.updateCoord(str);
            this.movePointer.push(line);
            this.ap--;
            moveContainer.addChild(line);
            this.drawHelper();
        }
    }

    backCheck(str) {
        switch (str) {
            case "up":
                 return this.moves[this.moves.length - 1] == "down";
            case "down":
                return this.moves[this.moves.length - 1] == "up";
            case "right":
                return this.moves[this.moves.length - 1] == "left";
            case "left":
                return this.moves[this.moves.length - 1] == "right";
        }
    }

    borderCheck(str) {
        switch (str) {
            case "up":
                return this.curY - 48 >= yCentral - 2 * 48;
            case "down":
                return this.curY + 48 <= yCentral + 2 * 48;
            case "right":
                return this.curX + 48 <= xCentral + 4 * 48;
            case "left":
                return this.curX - 48 >= xCentral - 4 * 48;
        }
    }

    drawHelper() {
        //Draw box
        this.helper = new PIXI.Graphics();
        this.helper.lineStyle(2, 0x5a5a5a, 1);
        this.helper.beginFill(0x808080);
        this.helper.drawRect(this.curX + 5, this.curY + 5, 100, 50);
        this.helper.endFill();
        this.helper.interactive = true;
        this.helper.on('pointerdown', function () {  confirmMove(); });
        moveContainer.addChild(this.helper);

        //Draw text
        this.helpertext = new PIXI.Text("AP Left:" + this.ap + "\nConfirm?", textStyleHelper);
        this.helpertext.x = this.curX + 10;
        this.helpertext.y = this.curY + 10;
        moveContainer.addChild(this.helpertext);
    }

    removeHelper() {
        moveContainer.removeChild(this.helper);
        moveContainer.removeChild(this.helpertext);
    }
    
    updateCoord(str) {
        switch (str) {
            case "up":
                this.curY -= 48;
                break;
            case "down":
                this.curY += 48;
                break;
            case "right":
                this.curX += 48;
                break;
            case "left":
                this.curX -= 48;
                break; 
        }
    }

    cleanup() {
        while (moveContainer.children[0]) {
            moveContainer.removeChild(moveContainer.children[0]);
        }
        while (this.moves[0]) {
            this.moves.pop();
            this.movePointer.pop();
        }
        this.helper = 0;
        this.helpertext = 0;
    }
}

var mIndicator = 0;

function confirmMove() {
    playerVal.ap = mIndicator.ap;
    player.move(mIndicator.curX, mIndicator.curY, mIndicator.moves);
    mIndicator.cleanup();
    updateAP();
}
