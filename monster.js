

//モンスターの種類
var Monster_Kind = {
    A : 1,
    B : 2,
    C : 3,
};

//モンスターのHP
var Monster_HP = 100;

//モンスターのステータス
var Monster_Status = {
    None: 0,
    Create : 1,
    Normal : 2,
    Atacking : 3,
    Atacked : 4,
    Dead : 5
};

class Monster{
    constructor()
    {
        this.x=0;
        this.y=0;
        this.z=0;
        this.scale=1;
        this.angle=0;
        this.img=null;
        this.kind=Monster_Kind.A;
        this.hp =Monster_HP; 
        this.status = Monster_Status.None;
        this.prestatus = Monster_Status.None;
        this.imgDict = {};
        this.img = null;
    }
    //let img=null;
    setImage(mstatus, img)
    {
        //ステータスと、imgの紐付けを行う。
        this.imgDict[mstatus] = img;
    }

    draw()
    {
        
        push();
        translate(100,100);
        rotate(this.angle);
        scale(this.scale);
        image(this.img,0,0);
        //image(this.imgDict[this.status],0,0);
        
        //image(this.img,this.x,this.y);
        
        pop();
    }
}
