//マジックの種類
var Magic_Kind = {
    Fire: 0,
    Water: 1,
    Wood: 2,
    Beam: 3,
};

//マジックの速度
var Magic_Speed = {
    Low: 300,
    Middle: 500,
    High: 700
}



//マジックのPower
var Magic_Power = 25;

//マジックのステータス
var Magic_Status = {
    None: 0,
    Create: 1,
    Normal: 2,
    Hit: 3,
    End: 4
};

class Magic {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.target_x = 0;
        this.target_y = 0;
        this.scale = 1;
        this.angle = 0;
        this.oid = -1;
        this.kind = Magic_Kind.Fire;
        this.power = Magic_Power;
        this.status = Magic_Status.None;
        this.imgDict = {};
        this.preImgTime = Date.now(); //画像更新前の時間
        this.preStatusTime = Date.now();//ステータスの切り替え用
        this.imgIndex = 0;
        this.velo = [0, 0];  //速度
        this.preTime = 0; //draw 更新前の時間
        this.message = '';
    }

    //マジックを複製する。
    clone() {
        //もう少し、格好いいやり方あると思います。
        var clone = new Magic();
        //コピーが必要なものだけコピーする。
        clone.scale = this.scale;
        clone.angle = this.angle;
        clone.kind = this.kind;
        clone.power = this.power;
        clone.status = this.status;
        clone.imgDict = this.imgDict;
        clone.preImgTime = Date.now();
        this.preStatusTime = Date.now();
        clone.imgIndex = this.imgIndex;
        clone.velo = [0, 0];
        clone.preTime = Date.now();
        clone.message = this.message;

        return clone;
        /*
        //以下だと、関数が引き継がれない。
        let clone = new Magic();

        for (let prop of this.constructor.clone_properties) {
            clone[prop] = this[prop].clone();
        }
        return clone;*/

    }

    //速度を設定する。
    setVelocity(sPos, ePos, scale) {
        this.velo[0] = (ePos[0] - sPos[0]) / Math.sqrt((ePos[0] - sPos[0]) ** 2 + (ePos[1] - sPos[1]) ** 2) * scale;
        this.velo[1] = (ePos[1] - sPos[1]) / Math.sqrt((ePos[0] - sPos[0]) ** 2 + (ePos[1] - sPos[1]) ** 2) * scale;
        console.log("s ", sPos, " e ", ePos, " velo ", this.velo);
    }

    setImage(mstatus, img) {
        //ステータスと、imgの紐付けを行う。
        this.imgDict[mstatus] = img;
        var timg = this.imgDict[mstatus];
        console.log("img", timg)
    }

    //statusを変える場合は、これを使う。
    changeStatus(status) {
        //ステータスが一緒だったら、何も行わない。
        /*if(this.status == status){
            return;
        }*/
        this.status = status;
        this.imgIndex = 0;
        this.preImgTime = Date.now();
        this.preStatusTime = Date.now();
    }

    draw() {
        //statusがnoneの場合には、何も行わない。
        if (this.status == Magic_Status.None) {
            return;
        }

        //console.log("magic state ", this.status);
        let timg = null;

        //console.log("this.imgIndex", this.imgIndex);      
        timg = this.imgDict[this.status][this.imgIndex];
        if (Date.now() - this.preImgTime > 300) {
            this.imgIndex += 1;
            if (this.imgDict[this.status].length <= this.imgIndex) {
                this.imgIndex = 0;
                //craeate statusの場合には、normalに変える。
                if (this.status == Magic_Status.Create) {
                    this.changeStatus(Magic_Status.Normal);
                }
            }
            this.preImgTime = Date.now();
        }
        //console.log("status=",this.status,"timgIndex=",this.imgIndex,"length=",this.imgDict[this.status].length,timg);
        push();
        //ヒットの時だけ、ランダム動作
        if (this.status == Magic_Status.Hit) {
            translate(this.x - timg.width / 2 + Math.random() * 20, this.y - timg.height / 2 + Math.random() * 20);
        } else {
            translate(this.x - timg.width / 2, this.y - timg.height / 2);
        }
        rotate(this.angle);
        scale(this.scale);
        image(timg, 0, 0);

        let r = 255;
        let g = 255;
        let b = 255;

        if(this.kind == Magic_Kind.Fire){
            r = 255;
            g = 0;
            b = 0;
        }else if(this.kind == Magic_Kind.Water){
            r = 0;
            g = 0;
            b = 255;
        }else if(this.kind == Magic_Kind.Wood){
            r = 0;
            g = 255;
            b = 0;
        }

        fill(r, g, b);
        textSize(80);
        text(convertRomanToKana(this.message), 30, 0);
        pop();

        //属性の更新
        //Normal,Hitの場合には、移動します。
        this.x = this.x + this.velo[0] * (Date.now() - this.preTime) / 1000.0;
        this.y = this.y + this.velo[1] * (Date.now() - this.preTime) / 1000.0;

        //画面のY方向の外に近くなったら消える
        if (this.y < 100 && !(this.status == Magic_Status.End)) {
            this.changeStatus(Magic_Status.End);
        }

        //end statusの場合には消える
        if (this.status == Magic_Status.End && Date.now() - this.preStatusTime > 500) {
            //console.log("change to none");
            this.changeStatus(this.status = Magic_Status.None);
            return;
        }
        //hitの場合も消える。
        if (this.status == Magic_Status.Hit && Date.now() - this.preStatusTime > 500) {
            //console.log("change to none");
            this.changeStatus(this.status = Magic_Status.None);
            return;
        }
        this.preTime = Date.now();
    }
}
