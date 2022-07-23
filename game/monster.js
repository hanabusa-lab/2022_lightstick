//モンスターの種類
var Monster_Kind = {
    Dragon_Fire: 0,
    Dragon_Water: 1,
    Dragon_Wood: 2,
    Mob_Fire: 3,
    Mob_Water: 4,
    Mob_Wood: 5,
};

//モンスターのHP
var Monster_HP = 100;

//モンスターのステータス
var Monster_Status = {
    None: 0,
    Create: 1,
    Normal: 2,
    Atacking: 3,
    Atacked: 4,
    Dead: 5
};

class Monster {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.scale = 1;
        this.angle = 0;
        this.kind = Monster_Kind.A;
        this.hp = Monster_HP;
        this.hpMax = this.hp;
        this.status = Monster_Status.None;
        this.imgDict = {};
        this.img = null;
        this.preImgTime = Date.now(); //画像切り替えに用いる時刻
        this.preStatusTime = Date.now(); //ステータス切り替えに用いる時刻
        this.imgIndex = 0;
        this.preTime = 0; //draw 更新前の時間
        this.uid = 0; //対応するユニット番号
        this.magicKind = Magic_Kind.Fire;
    }

    //マジックを複製する。
    clone() {
        //もう少し、格好いいやり方あると思います。
        var clone = new Monster();
        //コピーが必要なものだけコピーする。
        clone.x = this.x;
        clone.y = this.y;
        clone.z = this.z;
        clone.scale = this.scale;
        clone.angle = this.angle;
        clone.kind = this.kind;
        clone.hp = this.hp;
        clone.hpMax = this.hpMax;
        clone.status = this.status;
        clone.imgDict = this.imgDict;
        clone.preImgTime = Date.now();
        this.preStatusTime = Date.now();
        clone.imgIndex = this.imgIndex;
        clone.preTime = Date.now();
        clone.uid = this.uid;
        clone.magicKind = this.magicKind;
        return clone;
    }

    //let img=null;
    setImage(mstatus, img) {
        //ステータスと、imgの紐付けを行う。
        this.imgDict[mstatus] = img;
        //var timg = this.imgDict[mstatus];
        //console.log("img", timg)
    }

    //statusを変える場合は、これを使う。
    changeStatus(status) {
        this.status = status;
        this.imgIndex = 0;
        this.preImgTime = Date.now();
        this.preStatusTime = Date.now();
    }

    draw() {
        //StatusがNoneの時には、何もやらない。
        if (this.status == Monster_Status.None) {
            return;
        }
        //画像の取得
        let timg = null;
        timg = this.imgDict[this.status][this.imgIndex];
        if (Date.now() - this.preImgTime > 30) {
            this.imgIndex += 1;
            if (this.imgDict[this.status].length <= this.imgIndex) {
                this.imgIndex = 0;
            }
            this.preImgTime = Date.now();
        }

        push();
        if (this.status == Monster_Status.Atacked) {
            //攻撃されたら ぶるぶるする。
            translate(this.x - timg.width / 2 + Math.random() * 20, this.y - timg.height / 2 + Math.random() * 20);
        } else {
            translate(this.x - timg.width / 2, this.y - timg.height / 2);
        }
        rotate(this.angle);
        scale(this.scale);
        image(timg, this.x, this.y, timg.width * this.scale, timg.height * this.scale);
        // image(timg, 0, 0, timg.width * this.scale, timg.height * this.scale);

        fill(255, 255, 0);
        // text("HP:"+this.hp,20,20); 
        rect(this.x, this.y, (this.hp) * 4, 20)
        // rect(820, 600, (this.hp) * 2, 20)
        pop();

        //状態の更新 createは一定時刻が経ったら解除する
        if (this.status == Monster_Status.Create && Date.now() - this.preStatusTime > 1000) {
            this.changeStatus(Monster_Status.Normal);
        }

        //状態の更新 Atackedは一定時刻が経ったら解除する
        if (this.status == Monster_Status.Atacked && Date.now() - this.preStatusTime > 500) {
            this.changeStatus(Monster_Status.Normal);
        }

        //状態の更新 Deadは一定時刻が経ったらNoneにする。
        if (this.status == Monster_Status.Dead && Date.now() - this.preStatusTime > 1000) {
            this.changeStatus(Monster_Status.None);
        }
    }
}
