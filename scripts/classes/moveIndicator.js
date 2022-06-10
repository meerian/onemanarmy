import { updateAP } from "../pages/gamePage.js";

export class moveIndicator {
    constructor(x, y, ap) {
        this.curX = x;
        this.curY = y;
        this.moves = [];
        this.movePointer = [];
        this.helpertext = 0;
        this.ap = ap;
        app.stage.addChild(moveContainer);
        mIndicator = this;
    }

    update(str) {
        pointerdownAudio.currentTime = 0;
        pointerdownAudio.play();
        if (this.moves.length > 0 && this.backCheck(str)) {
            this.removeHelper();
            this.moves.pop();
            moveContainer.removeChild(this.movePointer.pop());
            this.ap++;
            this.updateCoord(str);
            if (this.moves.length) {
                this.drawHelper();
            } 
        } else if (this.ap && this.validityCheck(str)) {
            this.removeHelper();
            let line = new PIXI.Graphics();
            line.position.set(this.actualX(), this.actualY());
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

    enemyCheck(x, y) {
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].x == x && enemies[i].y == y && enemies[i].isAlive) {
                return false;
            }
        }
        return true;
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

    validityCheck(str) {
        switch (str) {
            case "up":
                return this.actualY() - 48 >= yCentral - 2 * 48 && this.enemyCheck(this.curX, this.curY - 1);
            case "down":
                return this.actualY() + 48 <= yCentral + 2 * 48 && this.enemyCheck(this.curX, this.curY + 1);
            case "right":
                return this.actualX() + 48 <= xCentral + 5 * 48 && this.enemyCheck(this.curX + 1, this.curY);
            case "left":
                return this.actualX() - 48 >= xCentral - 4 * 48 && this.enemyCheck(this.curX - 1, this.curY);
        }
    }

    actualY() {
        return yCentral + (this.curY - 2) * 48 + player.yNudge + 15;
    }

    actualX() {
        return xCentral + (this.curX - 4) * 48 + player.xNudge;
    }

    drawHelper() {

        //Draw text
        this.helpertext = new PIXI.Text("AP Left:" + this.ap + "\nClick to Confirm", textStyleHelper);
        this.helpertext.x = this.actualX() + 15;
        this.helpertext.y = this.actualY() - 5;
        this.helpertext.interactive = true;
        this.helpertext.on('pointerdown', function () {  confirmMove(); });
        moveContainer.addChild(this.helpertext);
    }

    removeHelper() {
        moveContainer.removeChild(this.helpertext);
    }
    
    updateCoord(str) {
        switch (str) {
            case "up":
                this.curY -= 1;
                break;
            case "down":
                this.curY += 1;
                break;
            case "right":
                this.curX += 1;
                break;
            case "left":
                this.curX -= 1;
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
        this.curX = player.x;
        this.curY = player.y;
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
