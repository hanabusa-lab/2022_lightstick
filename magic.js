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
        this.target_x=0;
        this.target_y=0;
        this.target_z=0;
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
        this.preImgTime = Date.now();
        this.imgIndex=0;
    }

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
        clone.preImgTime = this.preImgTime;
        clone.imgIndex = this.imgIndex;
        
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
        push();
        //translate(100,100);
        if(this.status==Magic_Status.Normal){
            translate(this.x,this.y);
        }
      
        if(this.status==Magic_Status.Atacking){
            translate(this.x+Math.random()*30,this.y+Math.random()*30);
        }
      
        rotate(this.angle);
        scale(this.scale);
        //image(this.img,0,0);
        //ノーマルの時には、画像が複数あるので、
        if(this.status==Magic_Status.Normal){
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
