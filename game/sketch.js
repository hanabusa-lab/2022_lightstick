//import { convertRomanToKana } from "./convertRomanToKana.js";

let gCanvasSize = [1280, 1024]; //キャンバスサイズ
let gMonitorSize = [1280, 100]; //モニターのサイズ
let gTargetPosDict = {};//ターゲットの位置リスト
let gMonsterLibDict = {}; //モンスターライブラリのリスト
let gMonsterList = []; //モンスターのリスト
let gMonsterCallTime = 0;

//マジックのリスト(テンプレート)。実際のマジックは、ここにあるテンプレートをコピーして発動する。
//マジックの画像などを保持すつことを目的として作っている。
let gMagicLibDict = {};
let gMagicList = [];　//マジックのリスト
let gPlayerList = [];//プレイヤーのリスト

//デバック用
let gTestFg = true;
let gTestOid = 0;
let gTestUid = 0;
let gTestMessageList = ["honoo","auau","iuiu"];
let gTestMessageIndex = 0;
var Test_Mode = {Oid:1, Uid:2, Message:3};
let gTestMode = Test_Mode.Oid;

//音テスト
let gSoundFire;

//アセットの読み込み、各種情報の初期化
function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  frameRate(30);

  //ユニット毎のターゲット位置を初期化する。
  gTargetPosDict[0] = [(gCanvasSize[0])/4, (gCanvasSize[1]-gMonitorSize[1])/4];
  gTargetPosDict[1] = [(gCanvasSize[0])*3/4, (gCanvasSize[1]-gMonitorSize[1])/4];
  gTargetPosDict[2] = [(gCanvasSize[0])/4, (gCanvasSize[1]-gMonitorSize[1])*3/4];
  gTargetPosDict[3] = [(gCanvasSize[0])*3/4, (gCanvasSize[1]-gMonitorSize[1])*3/4];  

  //Ghost作成
  let monster = new Monster();
  monster.kind = Monster_Kind.Ghost;
  let timg = loadImage("assets/ghost_normal.png");
  monster.setImage(Monster_Status.Create, [timg]); //createはnormalと一緒
  monster.setImage(Monster_Status.Normal, [timg,loadImage("assets/ghost_normal2.png")]);
  monster.setImage(Monster_Status.Atacking, [loadImage("assets/ghost_atacking.png")]);
  timg = loadImage("assets/ghost_atacked.png");
  monster.setImage(Monster_Status.Atacked, [timg]);
  monster.setImage(Monster_Status.Dead, [timg]); //deadとatackedは一緒。
  //monster.changeStatus(Monster_Status.Create);
  //monster.x =getTargetPos(0)[0];
  //monster.y =getTargetPos(0)[1];
  
  //モンスターライブラリリストへの追加
  gMonsterLibDict[monster.kind]=monster;

  //ドラゴンの作成
  monster = new Monster();
  monster.kind = Monster_Kind.Dragon;
  monster.setImage(Monster_Status.Create, [loadImage("assets/dragon_create.jpg")]);
  monster.setImage(Monster_Status.Normal, [loadImage("assets/dragon_normal.jpg")]);
  monster.setImage(Monster_Status.Atacking, [loadImage("assets/dragon_atacking.jpg")]);
  monster.setImage(Monster_Status.Atacked, [loadImage("assets/dragon_atacked.jpg")]);
  monster.setImage(Monster_Status.Dead, [loadImage("assets/dragon_dead.jpg")]);
  monster.status = Monster_Status.Normal;

  //マジックの作成。テンプレートを作成。実際のものは、これをクローンいて生成する。
  //炎
  magic = new Magic();
  magic.kind = Magic_Kind.Fire;
  magic.setImage(Magic_Status.Create, [loadImage("assets/fire_create.png"),loadImage("assets/fire_create.png")])
  magic.setImage(Magic_Status.Normal, [loadImage("assets/fire_normal1.png"), loadImage("assets/fire_normal2.png"),])
  magic.setImage(Magic_Status.Hit, [loadImage("assets/fire_hit.png")])
  magic.setImage(Magic_Status.End, [loadImage("assets/fire_end.png")])
  gMagicLibDict[Magic_Kind.Fire]=magic;

  //音の読み込み
  soundFormats('mp3', 'ogg');
  gSoundFire = loadSound('assets/fire.mp3');
}

//画面関連の初期化
function setup() {
  createCanvas(gCanvasSize[0], gCanvasSize[1]);
  angleMode(DEGREES); 
}

//オペレータの位置を取得する
function getOperatorPos(oid){
  for(var player of gPlayerList){
    if(player.oid==oid){
      return [player.x, player.y];
    }
  }
  //見つからない場合には、端っこ。
  console.log("error. no oid")
  return [(gCanvasSize[0]-gMonitorSize[0]), (gCanvasSize[1]-gMonitorSize[1])]; 
}

//ターゲットの位置を取得する
function getTargetPos(uid){
  for(var k of Object.keys(gTargetPosDict)){
    //console.log("uid=",uid, "key=",k);
    if(uid == k){
      //console.log("hit uid=",uid, "key=",k);
      return gTargetPosDict[k];
    }
  }
  //見つからない場合には、端っこ。
  console.log("error. no uid,uid=",uid, Object.keys(gTargetPosDict))
  return [(gCanvasSize[0]-gMonitorSize[0]), (gCanvasSize[1]-gMonitorSize[1])];  
}

//受け取った内容に応じてMagicを作成する。
function createMagic(oid, uid, message){
  //oid(オペレータID)からスタート位置を決める。
  let opos = getOperatorPos(oid);

  //uid(受信機のID)からターゲットモンスターを決めてターゲット位置を決める。
  let tpos = getTargetPos(uid);

  //メッセージから呪文の種類を決める。
  //TBD今は、炎限定
  let magicKind = Magic_Kind.Fire;

  //マジックのテンプレートから、magicをクローンする。
  let magic = gMagicLibDict[Magic_Kind.Fire];
  //TBD magicがない時の対応は行うこと。
  
  //複製する。
  let cloneMagic = magic.clone();
  //cloneMagic = Object.assign( {}, magic);
  cloneMagic.x = opos[0];
  cloneMagic.y = opos[1];
  cloneMagic.target_x = tpos[0];
  cloneMagic.target_y = tpos[1];
  cloneMagic.oid = oid;
  cloneMagic.changeStatus(Magic_Status.Create);
  cloneMagic.setVelocity(opos, tpos, Magic_Speed.Low);

  //magic listに追加する。
  gMagicList.push(cloneMagic);
}

//プレーヤーの作成
function createPlayer(oid){
  //既に同じ番号のプレイヤーがいたら作成しない。
  let result = gPlayerList.filter(f => f.oid == oid);
  if(result.length>0){
    console.log("createPlayer oid exist.", oid);
    return;
  }
  
  var player = new Player();
  player.oid = oid;
  gPlayerList.push(player);

  //プレーヤーの数ごとに、モニタ上の位置を変更する。
  //TBD:プレーヤーは最大12名まで。今のところ4名まで。
  if(1<=gPlayerList.length && gPlayerList.length <=4){
    //for(var player of gPlayerList){
    for(var i=0; i<gPlayerList.length; i++){
      gPlayerList[i].x = gMonitorSize[0]/4*i+gMonitorSize[0]/8;
      gPlayerList[i].y = gCanvasSize[1]-gMonitorSize[1];    
    }
    //gPlayerList[0].x=500;
    //gPlayerList[0].y=500;
  }else{
    console.log("invalid playser number.")
  }
}

 //当たり判定確認
function checkHit(){
  let dist = 30;
  let tdist =0;
  for(var magic of gMagicList){
    for(var monster of gMonsterList){
      //monsterがNone状態なら何も行わない。
      if(monster.status == Monster_Status.None){
        continue;
      }

      tdist = Math.sqrt((magic.x-monster.x)**2+(magic.y-monster.y)**2);
      //console.log("tdist=",tdist);
      if( tdist < dist && magic.status!=Magic_Status.Hit && monster.status!=Monster_Status.Atacked){
        magic.changeStatus(Magic_Status.Hit);
        monster.changeStatus(Monster_Status.Atacked);
        monster.hp -= magic.power;
        if(monster.hp<=0){
          monster.hp = 0;
          monster.changeStatus(Monster_Status.Dead);
          //モンスターがすぐにと登場しないように、モンスター召喚時間をセットし直す。
          gMonsterCallTime = Date.now();
        }

        for(var player of gPlayerList){
          if(magic.oid == player.oid){
            player.point+=magic.power;
            console.log("point=", player.point, "power=",magic.power);
          }
        }
      }
    }
  }
}

//モンスターを召喚する
function callMonster(){
  //時間が早かったら、もしくは、4体既にいたらモンスターを召喚しない
  //tminからtmaの間の時間で召喚する。
  let tmin=3;
  let tmax=5;
  if(Date.now()-gMonsterCallTime < (Math.floor( Math.random() * (tmax +1 - tmin) ) + tmin)*1000){
    return;
  }
  //4体いる場合には追加しない。
  if(gMonsterList.length >=4 ){
    return;
  }

  //ランダムでgMonsterLibDictに入っているものから種別を決める
  let k = Object.keys(gMonsterLibDict)[Math.floor(Math.random() * Object.keys(gMonsterLibDict).length)];

  //コピーをする。
  let monster = gMonsterLibDict[k].clone();

  //空いている場所に配置する。
  let existList = [];
  for(let monster of gMonsterList){
    existList.push(String(monster.uid));
  }
  //existList.push('0');
  //existList.push('1');

  let emptyList =Object.keys(gTargetPosDict).filter(function(s){
  //console.log(existList, existList.indexOf(s));
  return existList.indexOf(s) == -1 })
  
  //ランダムで空いている場所を選ぶ
  let uid = parseInt(emptyList[ Math.floor( Math.random() * emptyList.length )]) ;
  
  monster.uid = uid;
  monster.x = getTargetPos(uid)[0];
  monster.y = getTargetPos(uid)[1];
  monster.changeStatus(Monster_Status.Create);

  gMonsterList.push(monster);
  
  gMonsterCallTime = Date.now();
}

//描画処理
function draw() {
    //背景の塗りつぶし
    background(0); 
    fill(255);
    textSize(20);

    //console.log("monster num",gMonsterList.length);

    //キーボードによる処理
    //nはモンスターのステータス変更
    if (keyIsPressed==true){
      //マジックの生成
      if (keyCode === RIGHT_ARROW) {
        console.log("right");
        if(gTestMode == Test_Mode.Oid){
          gTestOid+=1;
          if(gTestOid>3){
            gTestOid=3;
          }
        }
        if(gTestMode == Test_Mode.Uid){
          gTestUid+=1;
          if(gTestUid>3){
            gTestUid=3;
          }  
        }
        if(gTestMode == Test_Mode.Message){
          gTestMessageIndex+=1;
          if(gTestMessageList.length<=gTestMessageIndex){
            gTestMessageIndex=gTestMessageList.length-1;
          }  
        }
      }
      if (keyCode === LEFT_ARROW) {
        if(gTestMode == Test_Mode.Oid){
          gTestOid-=1;
          if(gTestOid<0){
            gTestOid=0;
          }
        }
        if(gTestMode == Test_Mode.Uid){
          gTestUid-=1;
          if(gTestUid<0){
            gTestUid=0;
          }  
        }
        if(gTestMode == Test_Mode.Message){
          gTestMessageIndex-=1;
          if(gTestMessageIndex<0){
            gTestMessageIndex=0;
          }  
        }
        console.log("left");
        //createMagic(0, 0, "FIRE");
      }
      //マジックの生成
      if (keyCode == RETURN) {
        console.log("return");
        createPlayer(gTestOid);
        createMagic(gTestOid, gTestUid, gTestMessageList[gTestMessageIndex]);
        //var player = gPlayerList.filter(p => p.oid == gTestOid);
        for(let p of gPlayerList){
          if(p.oid == gTestOid){
            p.message = gTestMessageList[gTestMessageIndex];
            console.log("player", p, p.message);
          }
        }
        //文字列変換
        let voice = convertRomanToKana(gTestMessageList[gTestMessageIndex]);
        console.log(voice);
        //gSoundFire.play();
        var myVoice = new p5.Speech();
        myVoice.speak(voice);
      }
      if (key == "o") {
        gTestMode = Test_Mode.Oid;
      }
      if (key == "u") {
        gTestMode = Test_Mode.Uid;
      }
      if (key == "m") {
        gTestMode = Test_Mode.Message;
      }
      
      //sleep
      let now = Date.now();
      while(true){
        if(Date.now()-now>100){
          break;
        }
      }    
    }

    //呪文の取得処理。
    let keys =gMessageList.getKeyList();
    let i=0;
    for (var k of keys) {
      //ou配列の0番目がOperatorID, ou配列の1番目がUnitID
      let ou = gMessageList.parseKey(k);
      let message = gMessageList.getMessage(ou[0],ou[1]);
      //console.log("message",message)
      text(k+" "+message, 200, 20+10*i);

      //文字が改行まで届いている場合
      if(gMessageList.isCompleted(message)){
        console.log("message completed");
        createPlayer(ou[0]);
        let expectedLen = gMessageList.getExpectMessageLength(ou[0], ou[1]);
        let message = gMessageList.getMessage(ou[0],ou[1]);
         console.log("operator=",ou[0]," unitid=",ou[1], " message=", message, " expected len=", expectedLen, " len=", message.length);
        createMagic(ou[0], ou[1], message);
        
        gMessageList.deleteMessage(ou[0],ou[1]);
      }
      i++;
    }

    //モンスターの表示
    for (var monster of gMonsterList) {
      monster.draw();
    }

    //プレーヤーの表示
    for (var player of gPlayerList) {
      player.draw();
    }

    //マジックの表示
    for (var magic of gMagicList) {
      magic.draw();     
    }
    //属性がNoneものものは削除する
    gMagicList = gMagicList.filter(n => n.status !== Magic_Status.None);
    gMonsterList = gMonsterList.filter(n => n.status !== Monster_Status.None);
    //console.log("magiclength=",gMagicList.length, "monster length=",gMonsterList.length);
    
    //デバック文の表示
    if(gTestFg){
      text("[Debug]\n oid="+gTestOid+" \n uid="+gTestUid+"\n message="+gTestMessageList[gTestMessageIndex], 10, 20);
    }

    //当たり判定確認
    checkHit();

    //モンスターを召喚する。
    callMonster();

    /*if(!gSoundFire.isPlaying()){
      gSoundFire.play();
    }*/
 }
