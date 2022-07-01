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
        this.preImgTime = Date.now(); //画像切り替えに用いる時刻
        this.preStatusTime = Date.now(); //ステータス切り替えに用いる時刻
        
        this.imgIndex=0;
    }
    //let img=null;
    setImage(mstatus, img)
    {
        //ステータスと、imgの紐付けを行う。
        this.imgDict[mstatus] = img;
        //var timg = this.imgDict[mstatus];
        //console.log("img", timg)
    }

    //statusを変える場合は、これを使う。
    changeStatus(status){
        this.status = status;
        this.imgIndex = 0;
        this.preImgTime = Date.now();
        this.preStatusTime = Date.now();
    }

    draw(){
        //StatusがNoneの時には、何もやらない。
        if(this.status == Monster_Status.None){
            return;
        }
        //画像の取得
        let timg = null;
        timg = this.imgDict[this.status][this.imgIndex];
        if(Date.now()-this.preImgTime>300){
            this.imgIndex+=1;
            if(this.imgDict[this.status].length<=this.imgIndex){
                this.imgIndex = 0;  
            }
            this.preImgTime = Date.now();
        }
       
        push();
        if(this.status==Monster_Status.Atacked){
            //攻撃されたら ぶるぶるする。
            translate(this.x+Math.random()*20,this.y+Math.random()*20);
        }else{
            translate(this.x,this.y);       
        }
        rotate(this.angle);
        scale(this.scale);
        image(timg,0,0);
        fill(122);
        text("HP:"+this.hp,20,20);      
        pop();

        //状態の更新 createは一定時刻が経ったら解除する
        if(this.status==Monster_Status.Create && Date.now()-this.preStatusTime > 1000){
            this.changeStatus(Monster_Status.Normal);
        }

        //状態の更新 Atackedは一定時刻が経ったら解除する
        if(this.status==Monster_Status.Atacked && Date.now()-this.preStatusTime > 1000){
            this.changeStatus(Monster_Status.Normal);
        }

        //状態の更新 Deadは一定時刻が経ったらNoneにする。
        if(this.status==Monster_Status.Dead && Date.now()-this.preStatusTime > 1000){
            this.changeStatus(Monster_Status.None);
        }
    }
}
