//モンスターの種類
var Monster_Kind = {
    Ghost : 1,
    Dragon : 2,
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
        this.preImgTime = Date.now();
        this.imgIndexNormal=0;
    }
    //let img=null;
    setImage(mstatus, img)
    {
        //ステータスと、imgの紐付けを行う。
        this.imgDict[mstatus] = img;
        var timg = this.imgDict[mstatus];
        console.log("img", timg)
    }

    draw(){
        push();
        //translate(100,100);
        if(this.status==Monster_Status.Normal){
            translate(this.x,this.y);
        }
      
        if(this.status==Monster_Status.Atacking){
            translate(this.x+Math.random()*30,this.y+Math.random()*30);
        }
      
        rotate(this.angle);
        scale(this.scale);
        //image(this.img,0,0);
        //ノーマルの時には、画像が複数あるので、
        if(this.status==Monster_Status.Normal){
            console.log("this.imgIndexNormal", this.imgIndexNormal)
              
            image(this.imgDict[this.status][this.imgIndexNormal],0,0);
            //image(this.imgDict[this.status][1],0,0);
            if(Date.now()-this.preImgTime>1000){
                this.imgIndexNormal+=1;
                if(this.imgDict[this.status].length<=this.imgIndexNormal){
                    this.imgIndexNormal = 0;
                }
                this.preImgTime = Date.now();
                console.log("this.imgIndexNormal", this.imgIndexNormal)
                 
            }

        }else{
            image(this.imgDict[this.status],0,0);    
        }
        
        pop();
    }
}
