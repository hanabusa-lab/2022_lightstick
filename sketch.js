// import {SystemManager} from './SystemManager.js'


const barWidth = 20;
let lastBar = -1;

let font,
  fontsize = 32;

//表示モンスター
//let monster1=new Monster();
//let monster1_img=null;
//let img=null;

//キャンバスサイズ
let gCanvasSize = [1280, 1024];

//モニターのサイズ
let gMonitorSize = [1280, 100];

//オペレータの位置リスト
let gOperatorPosDict = {};

//ターゲットの位置リスト
let gTargetPosDict = {};


//モンスターのリスト
let gMonsterList = [];
let gMonster_Ghost = new Monster();
let gMonster_Dragon = new Monster();


//マジックのリスト(テンプレート)。実際のマジックは、ここにあるテンプレートをコピーして発動する。
//マジックの画像などを保持すつことを目的として作っている。
let gMagicTempDict = {};
//マジックのリスト
let gMagicList = [];




// const { webFrame } = require('electron')
// webFrame.registerURLSchemeAsPrivileged('file')


function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  // font = loadFont('assets/SourceSansPro-Regular.ttf');
  //font = loadFont('assets/keifont.ttf');
  frameRate(30);

  //Ghost作成
  let monster = new Monster();
  monster.kind = Monster_Kind.Ghost;
  monster.setImage(Monster_Status.None, loadImage("assets/ghost_none.jpg"));
  monster.setImage(Monster_Status.Normal, [loadImage("assets/ghost_normal.jpg"),loadImage("assets/ghost_normal2.jpg") ]);
  monster.setImage(Monster_Status.Atacking, loadImage("assets/ghost_atacking.jpg"));
  monster.setImage(Monster_Status.Atacked, loadImage("assets/ghost_atacked.jpg"));
  monster.setImage(Monster_Status.Dead, loadImage("assets/ghost_dead.jpg"));
  monster.scale=0.1
  //モンスターリストへの追加
  gMonsterList.push(monster);

  //ドラゴンの作成
  monster = new Monster();
  monster.kind = Monster_Kind.Dragon;
  monster.setImage(Monster_Status.None, loadImage("assets/dragon_none.jpg"));
  monster.setImage(Monster_Status.Normal, loadImage("assets/dragon_normal.jpg"));
  monster.setImage(Monster_Status.Atacking, loadImage("assets/dragon_atacking.jpg"));
  monster.setImage(Monster_Status.Atacked, loadImage("assets/dragon_atacked.jpg"));
  monster.setImage(Monster_Status.Dead, loadImage("assets/dragon_dead.jpg"));
  monster.scale=0.1
  monster.status = Monster_Status.Normal;
  //モンスターリストへの追加
  //gMonsterList.push(monster);

  //マジックの作成
  magic = new Magic();
  magic.kind = Magic_Kind.Fire;
  magic.setImage(Magic_Status.Create, [loadImage("assets/fire_create.png")])
  magic.setImage(Magic_Status.Normal, [loadImage("assets/fire_normal1.png"), loadImage("assets/fire_normal2.png"),])
  magic.setImage(Magic_Status.Hit, [loadImage("assets/fire_hit.png")])
  magic.setImage(Magic_Status.End, [loadImage("assets/fire_end.png")])

  gMagicTempDict[Magic_Kind.Fire]=magic;
}

function setup() {
  createCanvas(gCanvasSize[0], gCanvasSize[1]);
  angleMode(DEGREES); 

  //モンスターの生成
  let monster=new Monster();
  monster.x =100;
  monster.y =100;

  //operatorの位置を初期化する。
  gOperatorPosDict[0] = [(gMonitorSize[0])/4, (gCanvasSize[1]-gMonitorSize[1]/2)];
  gOperatorPosDict[1] = [(gMonitorSize[0])/4*2, (gCanvasSize[1]-gMonitorSize[1]/2)];
  gOperatorPosDict[2] = [(gMonitorSize[0])/4*3, (gCanvasSize[1]-gMonitorSize[1]/2)];
  gOperatorPosDict[3] = [(gMonitorSize[0])/4*4, (gCanvasSize[1]-gMonitorSize[1]/2)];

  //ユニット毎のターゲット位置を初期化する。
  gTargetPosDict[0] = [(gCanvasSize[0])/4, (gCanvasSize[1]-gMonitorSize[1])/4];
  gTargetPosDict[1] = [(gCanvasSize[0])*3/4, (gCanvasSize[1]-gMonitorSize[1])/4];
  gTargetPosDict[2] = [(gCanvasSize[0])/4, (gCanvasSize[1]-gMonitorSize[1])*3/4];
  gTargetPosDict[3] = [(gCanvasSize[0])*3/4, (gCanvasSize[1]-gMonitorSize[1])*3/4];
  
}

//オペレータの位置を取得する
function getOperatorPos(oID){
  for(var key in gOperatorPosDict) {
    console.log(oID, key);
    if(oID==key){
      return gOperatorPosDict[key];
    }
  }
  //見つからない場合には、端っこ。
  return [(gCanvasSize[0]-gMonitorSize[0]), (gCanvasSize[1]-gMonitorSize[1])]; 
}

//ターゲットの位置を取得する
function getTargetPos(uID){
  for(var key in gTargetPosDict){
    if(uID==key){
      return gTargetPosDict[key];
    }
    //見つからない場合には、端っこ。
    return [(gCanvasSize[0]-gMonitorSize[0]), (gCanvasSize[1]-gMonitorSize[1])];
  }
}

//受け取った内容に応じてMagicを作成する。
function createMagic(oID, uID, message){
  //oID(オペレータID)からスタート位置を決める。
  let opos = getOperatorPos(oID);

  //uID(受信機のID)からターゲットモンスターを決めてターゲット位置を決める。
  let tpos = getTargetPos(uID);

  //メッセージから呪文の種類を決める。
  //TBD今は、炎限定
  let magicKind = Magic_HP.Fire;

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
  cloneMagic.status = Magic_Status.Create;

  //magic listに追加する。
  gMagicList.push(cloneMagic);
}

//let systemManager = new SystemManager;

function draw() {
    //背景の塗りつぶし
    background(0); 
    fill(255);
    textSize(12);

    //キーボードによる処理
    //nはモンスターのステータス変更
    if (keyIsPressed==true && key == "n") {
      console.log("n");
      //monster listのステータスを変える
      for (let i = 0; i < gMonsterList.length; ++i) {
        gMonsterList[i].status = Monster_Status.Normal;
      }   
    }
    if (keyIsPressed==true && key == "a") {
      console.log("a");
      //monster listのステータスを変える
      for (let i = 0; i < gMonsterList.length; ++i) {
        gMonsterList[i].status = Monster_Status.Atacking;
      }   
    }
    if (keyIsPressed==true && key == "d") {
      console.log("d");
      //monster listのステータスを変える
      for (let i = 0; i < gMonsterList.length; ++i) {
        gMonsterList[i].status = Monster_Status.Dead;
      }   
    }
    //マジックの生成
    if (keyIsPressed==true && key == "m") {
      console.log("m");
      createMagic(0, 0, "FIRE");
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
      //text("auau", 10, 10+10*i);
    }

    //モンスターの表示
    for (let i = 0; i < gMonsterList.length; ++i) {
      gMonsterList[i].draw();
    }

    //マジックの表示
    for (let i = 0; i < gMagicList.length; ++i) {
      gMagicList[i].draw();
    }

    //monster1.draw();
    //monster1.scale=0.1;
    //monster1.angle+=0.1;
    
  //systemManager.executeSystem();
}



