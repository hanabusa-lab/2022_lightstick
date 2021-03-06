//import { convertRomanToKana } from "./convertRomanToKana.js";

let gCanvasSize = [1600, 1200]; //キャンバスサイズ
let gMonitorSize = [1600, 100]; //モニターのサイズ
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
let gTestMessageList = ["honoo", "arashi", "iuiu"];
let gTestMessageIndex = 0;
var Test_Mode = { Oid: 1, Uid: 2, Message: 3 };
let gTestMode = Test_Mode.Oid;

//音テスト
let gSoundFire;

let gBackImg;
let gBackPointImg;

let gFontFire;
let gFontWater;
let gFontWood;
let gFontSystem;
let gFontOther;
let gFont;

let gSeAttackMagicList = [];
let gSeMonsterList = [];
let gBgmList = [];



//アセットの読み込み、各種情報の初期化
function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  frameRate(30);

  //ユニット毎のターゲット位置を初期化する。
  gTargetPosDict[0] = [(gCanvasSize[0]) / 4, (gCanvasSize[1] - gMonitorSize[1]) / 4];
  gTargetPosDict[1] = [(gCanvasSize[0]) * 3 / 4, (gCanvasSize[1] - gMonitorSize[1]) / 4];
  gTargetPosDict[2] = [(gCanvasSize[0]) / 4, (gCanvasSize[1] - gMonitorSize[1]) * 3 / 4];
  gTargetPosDict[3] = [(gCanvasSize[0]) * 3 / 4, (gCanvasSize[1] - gMonitorSize[1]) * 3 / 4];


  // 炎強モンスター
  let monster = new Monster();
  monster.kind = Monster_Kind.Dragon_Fire;
  monster.hp = 200;
  monster.hpMax = 200;
  monster.magicKind = Magic_Kind.Water;
  monster.scale = 1;
  let timg = loadImage("assets/monster_fire0.png");
  monster.setImage(Monster_Status.Create, [timg]); //createはnormalと一緒
  monster.setImage(Monster_Status.Normal, [timg]);
  monster.setImage(Monster_Status.Atacking, [timg]);
  timg = loadImage("assets/monster_fire0.png");
  monster.setImage(Monster_Status.Atacked, [timg]);
  monster.setImage(Monster_Status.Dead, [timg]); //deadとatackedは一緒。
  monster.status = Monster_Status.Normal;
  //monster.changeStatus(Monster_Status.Create);
  //monster.x =getTargetPos(0)[0];
  //monster.y =getTargetPos(0)[1];

  //モンスターライブラリリストへの追加
  gMonsterLibDict[monster.kind] = monster;

  // 水強モンスター
  monster = new Monster();
  monster.kind = Monster_Kind.Dragon_Water;
  monster.hp = 200;
  monster.hpMax = 200;
  monster.magicKind = Magic_Kind.Wood;
  monster.scale = 1;
  monster.setImage(Monster_Status.Create, [loadImage("assets/monster_water0.png")]);
  monster.setImage(Monster_Status.Normal, [loadImage("assets/monster_water0.png")]);
  monster.setImage(Monster_Status.Atacking, [loadImage("assets/monster_water0.png")]);
  monster.setImage(Monster_Status.Atacked, [loadImage("assets/monster_water0.png")]);
  monster.setImage(Monster_Status.Dead, [loadImage("assets/monster_water0.png")]);
  monster.status = Monster_Status.Normal;
  gMonsterLibDict[monster.kind] = monster;

  // 木強モンスター
  monster = new Monster();
  monster.kind = Monster_Kind.Dragon_Wood;
  monster.hp = 200;
  monster.hpMax = 200;
  monster.magicKind = Magic_Kind.Fire;
  monster.scale = 1;
  monster.setImage(Monster_Status.Create, [loadImage("assets/monster_wood0.png")]);
  monster.setImage(Monster_Status.Normal, [loadImage("assets/monster_wood0.png")]);
  monster.setImage(Monster_Status.Atacking, [loadImage("assets/monster_wood0.png")]);
  monster.setImage(Monster_Status.Atacked, [loadImage("assets/monster_wood0.png")]);
  monster.setImage(Monster_Status.Dead, [loadImage("assets/monster_wood0.png")]);
  monster.status = Monster_Status.Normal;
  gMonsterLibDict[monster.kind] = monster;

  // 炎弱モンスター
  monster = new Monster();
  monster.kind = Monster_Kind.Mob_Fire;
  monster.magicKind = Magic_Kind.Water;
  monster.scale = 1;
  timg = loadImage("assets/monster_fire1.png");
  monster.setImage(Monster_Status.Create, [timg]); //createはnormalと一緒
  monster.setImage(Monster_Status.Normal, [timg]);
  monster.setImage(Monster_Status.Atacking, [timg]);
  timg = loadImage("assets/monster_fire1.png");
  monster.setImage(Monster_Status.Atacked, [timg]);
  monster.setImage(Monster_Status.Dead, [timg]); //deadとatackedは一緒。
  monster.hp = 100;
  monster.hpMax = 100;

  //モンスターライブラリリストへの追加
  gMonsterLibDict[monster.kind] = monster;

  // 水弱モンスター
  monster = new Monster();
  monster.kind = Monster_Kind.Mob_Water;
  monster.hp = 100;
  monster.hpMax = 100;
  monster.magicKind = Magic_Kind.Wood;
  monster.scale = 1;
  monster.setImage(Monster_Status.Create, [loadImage("assets/monster_water1.png")]);
  monster.setImage(Monster_Status.Normal, [loadImage("assets/monster_water1.png")]);
  monster.setImage(Monster_Status.Atacking, [loadImage("assets/monster_water1.png")]);
  monster.setImage(Monster_Status.Atacked, [loadImage("assets/monster_water1.png")]);
  monster.setImage(Monster_Status.Dead, [loadImage("assets/monster_water1.png")]);
  monster.status = Monster_Status.Normal;
  gMonsterLibDict[monster.kind] = monster;

  // 木弱モンスター
  monster = new Monster();
  monster.kind = Monster_Kind.Mob_Wood;
  monster.hp = 100;
  monster.hpMax = 100;
  monster.magicKind = Magic_Kind.Fire;
  monster.scale = 1;
  monster.setImage(Monster_Status.Create, [loadImage("assets/monster_wood1.png")]);
  monster.setImage(Monster_Status.Normal, [loadImage("assets/monster_wood1.png")]);
  monster.setImage(Monster_Status.Atacking, [loadImage("assets/monster_wood1.png")]);
  monster.setImage(Monster_Status.Atacked, [loadImage("assets/monster_wood1.png")]);
  monster.setImage(Monster_Status.Dead, [loadImage("assets/monster_wood1.png")]);
  monster.status = Monster_Status.Normal;
  gMonsterLibDict[monster.kind] = monster;



  //マジックの作成。テンプレートを作成。実際のものは、これをクローンいて生成する。
  //炎
  magic = new Magic();
  magic.kind = Magic_Kind.Fire;
  magic.setImage(Magic_Status.Create, [loadImage("assets/fire_create.png"), loadImage("assets/fire_create.png")])
  magic.setImage(Magic_Status.Normal, [loadImage("assets/fire_create.png"), loadImage("assets/fire_create.png"),])
  magic.setImage(Magic_Status.Hit, [loadImage("assets/fire_create.png")])
  magic.setImage(Magic_Status.End, [loadImage("assets/fire_create.png")])
  gMagicLibDict[Magic_Kind.Fire] = magic;


  //水
  magic = new Magic();
  magic.kind = Magic_Kind.Water;
  magic.setImage(Magic_Status.Create, [loadImage("assets/water_create.png"), loadImage("assets/water_create.png")])
  magic.setImage(Magic_Status.Normal, [loadImage("assets/water_create.png"), loadImage("assets/water_create.png"),])
  magic.setImage(Magic_Status.Hit, [loadImage("assets/water_create.png")])
  magic.setImage(Magic_Status.End, [loadImage("assets/water_create.png")])
  gMagicLibDict[Magic_Kind.Water] = magic;


  //木
  magic = new Magic();
  magic.kind = Magic_Kind.Wood;
  magic.setImage(Magic_Status.Create, [loadImage("assets/wood_create.png"), loadImage("assets/wood_create.png")])
  magic.setImage(Magic_Status.Normal, [loadImage("assets/wood_create.png"), loadImage("assets/wood_create.png"),])
  magic.setImage(Magic_Status.Hit, [loadImage("assets/wood_create.png")])
  magic.setImage(Magic_Status.End, [loadImage("assets/wood_create.png")])
  gMagicLibDict[Magic_Kind.Wood] = magic;

  gBackImg = loadImage('assets/background2.png');
  gBackPointImg = loadImage('assets/player_point_background.png');

  //音の読み込み
  soundFormats('mp3', 'ogg');
  // gSoundFire = loadSound('assets/fire.mp3');


  // gFontFire = loadFont('assets/IoEI.ttf');
  gFontFire = loadFont('assets/fontFire.otf');
  gFontWater = loadFont('assets/IoEI.ttf');
  // gFontWood = loadFont('assets/Hiran-Kanan_wood.TTF');
  gFontWood = loadFont('assets/fontWood.ttf');
  gFontSystem = loadFont('assets/IoEI.ttf');
  gFontOther = loadFont('assets/SourceSansPro-Regular.ttf');
  gFont = [gFontFire, gFontWater, gFontWood, gFontSystem, gFontOther];

  gSeAttackMagicList[0] = loadSound('assets/attack_sound/fireMagic1.mp3');
  gSeAttackMagicList[1] = loadSound('assets/attack_sound/waterMagic1.mp3');
  gSeAttackMagicList[2] = loadSound('assets/attack_sound/woodMagic1.mp3');
  gSeMonsterList[0] = loadSound('assets/attack_sound/monsterPop.mp3');
  gSeMonsterList[1] = loadSound('assets/attack_sound/monsterDisappear.mp3');
  gBgmList[0] = loadSound('assets/music/battleSound.mp3');

}

//画面関連の初期化
function setup() {
  createCanvas(gCanvasSize[0], gCanvasSize[1]);
  angleMode(DEGREES);
}

//オペレータの位置を取得する
function getOperatorPos(oid) {
  for (var player of gPlayerList) {
    if (player.oid == oid) {
      return [player.x, player.y];
    }
  }
  //見つからない場合には、端っこ。
  console.log("error. no oid")
  return [(gCanvasSize[0] - gMonitorSize[0]), (gCanvasSize[1] - gMonitorSize[1])];
}

//ターゲットの位置を取得する
function getTargetPos(uid) {

  var min = 0;
  var max = 3;


  // console.log("posRandam=", posRamdom)
  // return gTargetPosDict[posRamdomX];

  var gain = 250;
  var biasx = 250 / gain;
  var biasy = 400 / gain;
  var minX = 0 + biasx;
  var maxX = (gCanvasSize[0]) / gain - biasx;
  var minY = 0 + biasy;
  var maxY = (gCanvasSize[1]) / gain - biasy;

  var posRamdomX = (Math.floor(Math.random() * (maxX + 1 - minX)) + minX) * gain;
  var posRamdomY = (Math.floor(Math.random() * (maxY + 1 - minY)) + minY) * gain;

  return [posRamdomX, posRamdomY];
  // return [400, 300];

  for (var k of Object.keys(gTargetPosDict)) {
    //console.log("uid=",uid, "key=",k);
    if (uid == k) {
      //console.log("hit uid=",uid, "key=",k);
      return gTargetPosDict[k];
    }
  }
  //見つからない場合には、端っこ。
  console.log("error. no uid,uid=", uid, Object.keys(gTargetPosDict))
  return [(gCanvasSize[0] - gMonitorSize[0]), (gCanvasSize[1] - gMonitorSize[1])];
}

//受け取った内容に応じてMagicを作成する。
function createMagic(oid, uid, message) {
  let magicSuccess = searchMagicDctinary(message);
  for (let j = 0; j < 3; j++) {
    if (magicSuccess[j] > 0) {
      gSeAttackMagicList[j].play();
      for (let i = 0; i < magicSuccess[j]; i = i + 1) {
        console.log("magic" + str(j) + " success: " + str(i) + '\n');

        //oid(オペレータID)からスタート位置を決める。
        let opos = getOperatorPos(oid);

        //uid(受信機のID)からターゲットモンスターを決めてターゲット位置を決める。
        let tpos = getTargetPos(uid);

        //メッセージから呪文の種類を決める。
        //TBD今は、炎限定
        let magicKind = Magic_Kind[j];

        //マジックのテンプレートから、magicをクローンする。
        let magic = gMagicLibDict[j];
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
        cloneMagic.setVelocity(opos, tpos, Magic_Speed.Middle);
        cloneMagic.message = message;

        //magic listに追加する。
        gMagicList.push(cloneMagic);
      }
    } else {
      console.log("magic" + str(j) + " fail\n");
    }

  }

}

//プレーヤーの作成
function createPlayer(oid) {
  //既に同じ番号のプレイヤーがいたら作成しない。
  let result = gPlayerList.filter(f => f.oid == oid);
  if (result.length > 0) {
    //console.log("createPlayer oid exist.", oid);
    return;
  }

  var player = new Player();
  player.oid = oid;
  gPlayerList.push(player);

  //プレーヤーの数ごとに、モニタ上の位置を変更する。
  //TBD:プレーヤーは最大12名まで。今のところ4名まで。
  let biasx = 200;
  let biasy = 100;
  if (1 <= gPlayerList.length && gPlayerList.length <= 4) {
    //for(var player of gPlayerList){
    for (var i = 0; i < gPlayerList.length; i++) {
      // gPlayerList[i].x = gMonitorSize[0] / 4 * i + gMonitorSize[0] / 8;
      // gPlayerList[i].y = gCanvasSize[1] - gMonitorSize[1];
      if (i == 0) {
        gPlayerList[i].x = 0 + biasx + 50;
        gPlayerList[i].y = 0 + biasy;
      } else if (i == 1) {
        gPlayerList[i].x = gCanvasSize[0] - biasx;
        gPlayerList[i].y = 0 + biasy;
      } else if (i == 2) {
        gPlayerList[i].x = 0 + biasx + 50;
        gPlayerList[i].y = gCanvasSize[1] - biasy - 80;
      } else if (i == 3) {
        gPlayerList[i].x = gCanvasSize[0] - biasx;
        gPlayerList[i].y = gCanvasSize[1] - biasy - 80;
      }
    }
    //gPlayerList[0].x=500;
    //gPlayerList[0].y=500;
  } else {
    console.log("invalid playser number.")
  }
}

//当たり判定確認
function checkHit() {
  let dist = 100;
  let tdist = 0;
  for (var magic of gMagicList) {
    for (var monster of gMonsterList) {
      //monsterがNone状態なら何も行わない。
      if (monster.status == Monster_Status.None) {
        continue;
      }

      tdist = Math.sqrt((magic.x - (monster.x + 200)) ** 2 + (magic.y - monster.y) ** 2);
      //console.log("tdist=",tdist);
      if (tdist < dist && magic.status != Magic_Status.Hit && monster.status != Monster_Status.Atacked && (magic.kind == (monster.magicKind))) {
        magic.changeStatus(Magic_Status.Hit);
        monster.changeStatus(Monster_Status.Atacked);
        monster.hp -= magic.power;
        if (monster.hp <= 0) {
          gSeMonsterList[1].play();
          monster.hp = 0;
          monster.changeStatus(Monster_Status.Dead);
          //モンスターがすぐにと登場しないように、モンスター召喚時間をセットし直す。
          gMonsterCallTime = Date.now();
        }

        for (var player of gPlayerList) {
          if (magic.oid == player.oid) {
            player.point += magic.power / 10;
            console.log("point=", player.point, "power=", magic.power);
          }
        }
      }
    }
  }
}

//モンスターを召喚する
function callMonster() {
  //時間が早かったら、もしくは、4体既にいたらモンスターを召喚しない
  //tminからtmaの間の時間で召喚する。
  let tmin = 0.5;
  let tmax = 1;
  if (Date.now() - gMonsterCallTime < (Math.floor(Math.random() * (tmax + 1 - tmin)) + tmin) * 1000) {
    return;
  }
  //4体いる場合には追加しない。
  if (gMonsterList.length >= 7) {
    return;
  }

  //ランダムでgMonsterLibDictに入っているものから種別を決める
  // 0-100の間で各モンスターの出る確率を変化させる
  let k = 0;
  var randVal = (Math.floor(Math.random() * (100 + 1 - 0)) + 0);
  // let k = Object.keys(gMonsterLibDict)[Math.floor(Math.random() * Object.keys(gMonsterLibDict).length)];
  if (randVal > 90) {
    k = 0;
  } else if (randVal > 80) {
    k = 1;
  } else if (randVal > 70) {
    k = 2;
  } else if (randVal > 50) {
    k = 3;
  } else if (randVal > 30) {
    k = 4;
  } else {
    k = 5;
  }


  //コピーをする。
  let monster = gMonsterLibDict[k].clone();

  //空いている場所に配置する。
  let existList = [];
  for (let monster of gMonsterList) {
    existList.push(String(monster.uid));
  }
  //existList.push('0');
  //existList.push('1');
  /*
    let emptyList = Object.keys(gTargetPosDict).filter(function (s) {
      //console.log(existList, existList.indexOf(s));
      return existList.indexOf(s) == -1
    })
    */

  //ランダムで空いている場所を選ぶ
  let uid = 0;// parseInt(emptyList[Math.floor(Math.random() * emptyList.length)]);

  monster.uid = uid;
  monster.x = getTargetPos(uid)[0] / 2;
  monster.y = getTargetPos(uid)[1] / 2;
  // monster.x = 500; getTargetPos(uid)[0];
  // monster.y = 500; getTargetPos(uid)[1];
  monster.changeStatus(Monster_Status.Create);

  gSeMonsterList[0].play();

  gMonsterList.push(monster);

  gMonsterCallTime = Date.now();
}

function resetScore() {
  for (var player of gPlayerList) {
    player.point = 0;
    console.log("Score reset");
  }
}

//描画処理
function draw() {
  //背景の塗りつぶし
  background(0);
  fill(255);
  textSize(20);
  image(gBackImg, 0, 0);

  if (gBgmList[0].isPlaying()) {

  } else {
    gBgmList[0].play();
  }

  for (let i = 0; i < 10; i++) {
    createPlayer(i);
  }

  //console.log("monster num",gMonsterList.length);

  //キーボードによる処理
  //nはモンスターのステータス変更
  if (keyIsPressed == true) {
    //マジックの生成
    if (keyCode === RIGHT_ARROW) {
      console.log("right");
      if (gTestMode == Test_Mode.Oid) {
        gTestOid += 1;
        if (gTestOid > 3) {
          gTestOid = 3;
        }
      }
      if (gTestMode == Test_Mode.Uid) {
        gTestUid += 1;
        if (gTestUid > 3) {
          gTestUid = 3;
        }
      }
      if (gTestMode == Test_Mode.Message) {
        gTestMessageIndex += 1;
        if (gTestMessageList.length <= gTestMessageIndex) {
          gTestMessageIndex = gTestMessageList.length - 1;
        }
      }
    }
    if (keyCode === LEFT_ARROW) {
      if (gTestMode == Test_Mode.Oid) {
        gTestOid -= 1;
        if (gTestOid < 0) {
          gTestOid = 0;
        }
      }
      if (gTestMode == Test_Mode.Uid) {
        gTestUid -= 1;
        if (gTestUid < 0) {
          gTestUid = 0;
        }
      }
      if (gTestMode == Test_Mode.Message) {
        gTestMessageIndex -= 1;
        if (gTestMessageIndex < 0) {
          gTestMessageIndex = 0;
        }
      }
      console.log("left");
      //createMagic(0, 0, "FIRE");
    }
    //マジックの生成
    if (keyCode == RETURN) {
      console.log("return");

      let magicSuccess = searchMagicDctinary(gTestMessageList[gTestMessageIndex]);
      for (let j = 0; j < 3; j++) {
        if (magicSuccess[j] > 0) {
          for (let i = 0; i < magicSuccess[j]; i++) {
            // createPlayer(gTestOid);
            // createMagic(gTestOid, gTestUid, gTestMessageList[gTestMessageIndex]);
            console.log("magic" + str(j) + " success: " + str(i) + '\n');
          }
        } else {
          console.log("magic" + str(j) + " fail\n");
        }

      }



      //createPlayer(gTestOid);
      //createMagic(gTestOid, gTestUid, gTestMessageList[gTestMessageIndex]);
      //var player = gPlayerList.filter(p => p.oid == gTestOid);
      for (let p of gPlayerList) {
        if (p.oid == gTestOid) {
          p.message = gTestMessageList[gTestMessageIndex];
          console.log("player", p, p.message);
        }
      }
      //文字列変換
      let voice = convertRomanToKana(gTestMessageList[gTestMessageIndex]);
      console.log(voice);
      //gSoundFire.play();
      var myVoice = new p5.Speech();
      // myVoice.speak(voice);


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
    if (key == "r") {
      resetScore(); // プレイヤーのスコアをリセット
    }

    //sleep
    let now = Date.now();
    while (true) {
      if (Date.now() - now > 100) {
        break;
      }
    }
  }

  //呪文の取得処理
  let keys = gMessageList.getKeyList();
  let i = 0;
  for (var k of keys) {
    //ou配列の0番目がOperatorID, ou配列の1番目がUnitID
    let ou = gMessageList.parseKey(k);
    let message = gMessageList.getMessage(ou[0], ou[1]);
    //console.log("message",message)
    text(k + " " + message, 300, 20 + 10 * i);
    if (message != '') {
      //   gDisplayedMsgList[k] = message;
      //   gDisplayedMsgKanaList[k] = convertRomanToKana(message);
      gPlayerList[ou[1]].message = message;
    }


    // for (var player of gPlayerList) {
    //   player.message = message;
    // }

    //文字が改行まで届いている場合
    if (gMessageList.isCompleted(message)) {

      console.log("message completed");

      let expectedLen = gMessageList.getExpectMessageLength(ou[0], ou[1]);
      let message = gMessageList.getMessage(ou[0], ou[1]);
      console.log("operator=", ou[0], " unitid=", ou[1], " message=", message.toLowerCase(), " expected len=", expectedLen, " len=", message.length);
      // message.replace(/[^0-9a-z]/gi, '');
      message = message.toLowerCase();
      message = message.replace(/\r?\n/g, '');

      console.log("operator=", ou[0], " unitid=", ou[1], " message=", message.toLowerCase(), " expected len=", expectedLen, " len=", message.length);
      let magicSuccess = searchMagicDctinary(message);
      createMagic(ou[1], ou[1], message);
      for (let j = 0; j < 3; j++) {
        if (magicSuccess[j] > 0) {
          for (let i = 0; i < (magicSuccess[j]); i++) {
            // createPlayer(ou[0]);
            // createPlayer(ou[1]);
            // createMagic(ou[1], ou[1], message);
            console.log("magic" + str(j) + " success: " + str(i) + '\n');
          }
        } else {
          console.log("magic" + str(j) + " fail\n");
        }
      }

      //呪文を発動したら、改行までのメッセージを削除する。
      gMessageList.deleteMessage(ou[0], ou[1]);
    }
    i++;
  }

  //モンスターの表示
  for (var monster of gMonsterList) {
    monster.draw();
  }

  //プレーヤーの表示→表示順番のため下部に移動
  //  for (var player of gPlayerList) {
  //    player.draw();
  //  }

  //マジックの表示
  for (var magic of gMagicList) {
    magic.draw();
  }
  //属性がNoneものものは削除する
  gMagicList = gMagicList.filter(n => n.status !== Magic_Status.None);
  gMonsterList = gMonsterList.filter(n => n.status !== Monster_Status.None);
  //console.log("magiclength=",gMagicList.length, "monster length=",gMonsterList.length);

  //デバック文の表示
  if (gTestFg) {
    // text("[Debug]\n oid=" + gTestOid + " \n uid=" + gTestUid + "\n message=" + gTestMessageList[gTestMessageIndex], 10, 20);
  }

  //当たり判定確認
  checkHit();

  //モンスターを召喚する。
  callMonster();

  // プレイヤーポイント・メッセージ表示枠を表示、モンスターよりも上に表示するためにcallMonster()よりも下に書く
  image(gBackPointImg, 0, 0);
  for (var player of gPlayerList) {
    player.draw();
  }

  /*if(!gSoundFire.isPlaying()){
    gSoundFire.play();
  }*/
}
