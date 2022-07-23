class Player {
    constructor() {
        this.oid = -1;
        this.name = "auau";
        this.point = 0;
        this.message = "iuiu";
        this.x = 0;
        this.y = 0;
    }

    draw() {
        //名前とかポイントとかマジックとか表示する。
        push();
        translate(this.x, this.y, 0);
        // text("Player ID="+this.oid+"\nPlayer Name="+this.name+"\nPoint="+this.point+"\nMessage="+this.message, 0, 0);    
        textFont(gFontOther);
        textSize(60);
        text(this.point, 30, 10);
        textSize(40);
        textFont(gFontOther);
        let msgLenMax = Math.min(this.message.length, 18)
        let msgLenKanaMax = Math.min(convertRomanToKana(this.message).length, 9)
        text(this.message.slice(0, msgLenMax), -210, 50);
        textSize(60);
        textFont(gFontSystem);
        text(convertRomanToKana(this.message).slice(0, msgLenKanaMax), -210, 120);
        pop();

    }
}
