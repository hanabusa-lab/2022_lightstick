class Player{
    constructor()
    {
        this.oid=-1;
        this.name="auau";
        this.point=0;
        this.magic="iuiu";
        this.x =0;
        this.y=0;
    }

    draw(){
        //名前とかポイントとかマジックとか表示する。
        push();
        translate(this.x, this.y, 0);
        text("Player ID="+this.oid+"\nPlayer Name="+this.name+"˜\nPoint="+this.point+"\nMessage="+this.message, 0, 0);    
        pop();
     
    }
}
