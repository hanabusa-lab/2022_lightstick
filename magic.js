//マジックの種類
var Magic_Kind = {
    Fire : 1,
    Ice : 2,
    Thunder : 3,
    Beam : 4,
};

//マジックのHP
var Magic_HP = 100;

//マジックのステータス
var Magic_Status = {
    None: 0,
    Create : 1,
    Normal : 2,
    Hit : 3,
    End : 4
};

class Magic{
    constructor()
    {
        this.x=0;
        this.y=0;
        this.z=0;
        this.target_x=0;
        this.target_y=0;  
        this.scale=1;
        this.angle=0;
        this.owner=-1;
        this.img=null;
        this.kind=Magic_Kind.Fire;
        this.hp =Magic_HP; 
        this.status = Magic_Status.None;
        this.prestatus = Magic_Status.None;
        this.imgDict = {};
        this.img = null;
        this.preImgTime = Date.now(); //画像更新前の時間
        this.imgIndex=0;
        this.velo = 1000;  //速度
        this.preTime = 0; //draw 更新前の時間
    }

    //マジックを複製する。
    clone() {
        //もう少し、格好いいやり方あると思います。
        var clone = new Magic();
        //コピーが必要なものだけコピーする。
        clone.scale = this.scale;
        clone.angle = this.angle;
        clone.img = this.img;
        clone.kind=this.kind;
        clone.hp =this.hp; 
        clone.status = this.status;
        clone.imgDict = this.imgDict;
        clone.preImgTime = Date.now();
        clone.imgIndex = this.imgIndex;
        clone.velo = this.velo;
        clone.preTime = Date.now();
        
        return clone;
        /*
        //以下だと、関数が引き継がれない。
		let clone = new Magic();

		for (let prop of this.constructor.clone_properties) {
			clone[prop] = this[prop].clone();
		}
		return clone;*/

	}
   
    setImage(mstatus, img)
    {
        //ステータスと、imgの紐付けを行う。
        this.imgDict[mstatus] = img;
        var timg = this.imgDict[mstatus];
        console.log("img", timg)
    }

    draw(){
        console.log("magic state ", this.status);
        push();
        let timg = null;
       
        console.log("this.imgIndex", this.imgIndex);      
        timg = this.imgDict[this.status][this.imgIndex];
        if(Date.now()-this.preImgTime>300){
            this.imgIndex+=1;
            if(this.imgDict[this.status].length<=this.imgIndex){
                this.imgIndex = 0;
                //craeate statusの場合には、normalに変える。
                if(this.status == Magic_Status.Create){
                    this.imgIndex = 0;
                    this.status = Magic_Status.Normal;
                }
                //end statusの場合には消える
                if(this.status == Magic_Status.End){
                    console.log("change to none");
                  
                    this.status = Magic_Status.None;
                }
            }
            this.preImgTime = Date.now();
        }
      
        //ヒットの時だけ、ランダム動作
        if(this.status==Magic_Status.Hit){
            translate(this.x+Math.random()*30,this.y+Math.random()*30);
        }else{
            translate(this.x-timg.width/2,this.y-timg.height/2);
        }
        rotate(this.angle);
        scale(this.scale);
        image(timg,0,0);
        pop();

        //Normalの場合には、移動します。
        if(this.status == Magic_Status.Normal){
            this.x = this.x - Math.sqrt((this.target_x -this.x)**2)/Math.sqrt((this.target_x -this.x)**2+(this.target_y -this.y)**2)*(Date.now()-this.preTime)/1000*this.velo;
            this.y = this.y - Math.sqrt((this.target_y -this.y)**2)/Math.sqrt((this.target_y -this.y)**2+(this.target_y -this.y)**2)*(Date.now()-this.preTime)/1000*this.velo;
        }

        //画面のY方向の外に近くなったら消える
        if(this.y < 100 && !(this.status == Magic_Status.End || this.status == Magic_Status.None)){
            this.status = Magic_Status.End;
            this.imgIndex = 0;
            this.preImgTime = Date.now();
        }

        this.preTime = Date.now();

    }
}
