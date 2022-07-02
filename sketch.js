let gCanvasSize = [1280, 1024]; //キャンバスサイズ
let gMonitorSize = [1280, 100]; //モニターのサイズ
//let gOperatorPosDict = {};//オペレータの位置リスト
let gTargetPosDict = {};//ターゲットの位置リスト
let gMonsterList = []; //モンスターのリスト

//マジックのリスト(テンプレート)。実際のマジックは、ここにあるテンプレートをコピーして発動する。
//マジックの画像などを保持すつことを目的として作っている。
let gMagicTempDict = {};
let gMagicList = [];　//マジックのリスト
let gPlayerList = [];//プレイヤーのリスト
let gTestPlayserID = 0; //デバック用のプレーヤID

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
  monster.changeStatus(Monster_Status.Create);
  monster.x =getTargetPos(0)[0];
  monster.y =getTargetPos(0)[1];
  
  //モンスターリストへの追加
  gMonsterList.push(monster);

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
  gMagicTempDict[Magic_Kind.Fire]=magic;
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
  for(var key in gTargetPosDict){
    if(uid==key){
      return gTargetPosDict[key];
    }
    //見つからない場合には、端っこ。
    console.log("error. no uid")
    return [(gCanvasSize[0]-gMonitorSize[0]), (gCanvasSize[1]-gMonitorSize[1])];
  }
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
  let magic = gMagicTempDict[Magic_Kind.Fire];
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
  var player = new Player();
  player.oid = oid;
  gPlayerList.push(player);

  //プレーヤーの数ごとに、モニタ上の位置を変更する。
  //TBD:プレーヤーは最大12名まで。今のところ4名まで。
  if(1<=gPlayerList.length && gPlayerList.length <=4){
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

//描画処理
function draw() {
    //背景の塗りつぶし
    background(0); 
    fill(255);
    textSize(20);

    //キーボードによる処理
    //nはモンスターのステータス変更
    if (keyIsPressed==true){
      if(key == "n") {
        console.log("n");
        //monster listのステータスを変える
        for (let i = 0; i < gMonsterList.length; ++i) {
          gMonsterList[i].status = Monster_Status.Normal;
        }   
      }
      if (key == "a") {
        console.log("a");
        //monster listのステータスを変える
        for (let i = 0; i < gMonsterList.length; ++i) {
          gMonsterList[i].status = Monster_Status.Atacking;
        }   
      }
      if (key == "d") {
        console.log("d");
        //monster listのステータスを変える
        for (let i = 0; i < gMonsterList.length; ++i) {
          gMonsterList[i].status = Monster_Status.Dead;
        }   
      }
      //マジックの生成
      if (key == "m") {
        console.log("m");
        createMagic(0, 0, "FIRE");
      }
      //プレイヤーの生成
      if (key == "p") {
        console.log("p");
        createPlayer(gTestPlayserID);
        gTestPlayserID+=1;
      }
      let now = Date.now();
      while(true){
        if(Date.now()-now>100){
          break;
        }
      }    
    }

    let keys =gMessageList.getKeyList();
    //console.log("keys",keys);
    for (let i = 0; i < keys.length; ++i) {
      let ou = gMessageList.parseKey(keys[i]);
      let message = gMessageList.getMessage(ou[0],ou[1]);
      //console.log("message",message)
      text(keys[i]+" "+message, 10, 10+10*i);
      if(gMessageList.isCompleted(message)){
        gMessageList.deleteMessage(ou[0],ou[1]);
      }
    }

    //モンスターの表示
    for (let i = 0; i < gMonsterList.length; ++i) {
      gMonsterList[i].draw();
    }

    //プレーヤーの表示
    for (let i = 0; i < gPlayerList.length; ++i) {
      gPlayerList[i].draw();
    }

    //マジックの表示
    for (let i = 0; i < gMagicList.length; ++i) {
      gMagicList[i].draw();     
    }
    //属性がNoneものものは削除する
    gMagicList = gMagicList.filter(n => n.status !== Magic_Status.None);
    gMonsterList = gMonsterList.filter(n => n.status !== Monster_Status.None);
    //console.log("magiclength=",gMagicList.length, "monster length=",gMonsterList.length);
    
    //当たり判定確認
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
