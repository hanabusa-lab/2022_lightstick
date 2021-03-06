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
let gTestMessageList = ["honoo", "mukashimukasiarutokoronioziisanntoobaasangaimashita", "ziziitobabaagaimashita"];
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

let iTestKey = false;
let message0 = '';
let messageDisplay = '';

let gDisplayedMsgList = [];
let gDisplayedMsgKanaList = [];

let gSpeakVoiceKind = 0;


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


  //Ghost作成
  let monster = new Monster();
  monster.kind = Monster_Kind.Ghost;
  let timg = loadImage("assets/rizado_create.png");
  monster.setImage(Monster_Status.Create, [timg]); //createはnormalと一緒
  monster.setImage(Monster_Status.Normal, [timg, loadImage("assets/rizado_create.png")]);
  monster.setImage(Monster_Status.Atacking, [loadImage("assets/rizado_create.png")]);
  timg = loadImage("assets/rizado_create.png");
  monster.setImage(Monster_Status.Atacked, [timg]);
  monster.setImage(Monster_Status.Dead, [timg]); //deadとatackedは一緒。
  //monster.changeStatus(Monster_Status.Create);
  //monster.x =getTargetPos(0)[0];
  //monster.y =getTargetPos(0)[1];

  //モンスターライブラリリストへの追加
  gMonsterLibDict[monster.kind] = monster;

  //ドラゴンの作成
  monster = new Monster();
  monster.kind = Monster_Kind.Dragon;
  monster.hp = 200;
  monster.hpMax = 200;
  monster.setImage(Monster_Status.Create, [loadImage("assets/dragon_create.png")]);
  monster.setImage(Monster_Status.Normal, [loadImage("assets/dragon_create.png")]);
  monster.setImage(Monster_Status.Atacking, [loadImage("assets/dragon_create.png")]);
  monster.setImage(Monster_Status.Atacked, [loadImage("assets/dragon_create.png")]);
  monster.setImage(Monster_Status.Dead, [loadImage("assets/dragon_create.png")]);
  monster.status = Monster_Status.Normal;
  gMonsterLibDict[monster.kind] = monster;

  //マジックの作成。テンプレートを作成。実際のものは、これをクローンいて生成する。
  //炎
  magic = new Magic();
  magic.kind = Magic_Kind.Fire;
  magic.setImage(Magic_Status.Create, [loadImage("assets/fire_create.png"), loadImage("assets/fire_create.png")])
  magic.setImage(Magic_Status.Normal, [loadImage("assets/fire_normal1.png"), loadImage("assets/fire_normal2.png"),])
  magic.setImage(Magic_Status.Hit, [loadImage("assets/fire_hit.png")])
  magic.setImage(Magic_Status.End, [loadImage("assets/fire_end.png")])
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

  gBackImg = loadImage('assets/background_tutorial.png');
  gBackPointImg = loadImage('assets/player_point_background.png');

  //音の読み込み
  soundFormats('mp3', 'ogg');
  gSoundFire = loadSound('assets/fire.mp3');


  // gFontFire = loadFont('assets/SourceSansPro-Regular.otf');
  // gFontWater = loadFont('assets/SourceSansPro-Regular.otf');
  // gFontWood = loadFont('assets/SourceSansPro-Regular.otf');
  gFontSystem = loadFont('assets/IoEI.ttf');
  //   song = loadSound('assets/lucky_dragons_-_power_melody.mp3');

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

  var gain = 100;
  var biasx = 100 / gain;
  var biasy = 200 / gain;
  var minX = 0 + biasx;
  var maxX = gCanvasSize[0] / gain - biasx;
  var minY = 0 + biasy;
  var maxY = gCanvasSize[1] / gain - biasy;

  var posRamdomX = (Math.floor(Math.random() * (maxX + 1 - minX)) + minX) * gain;
  var posRamdomY = (Math.floor(Math.random() * (maxY + 1 - minY)) + minY) * gain;

  return [posRamdomX, posRamdomY];

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
      for (let i = 0; i < magicSuccess[j]; i = i + 4) {
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
        cloneMagic.setVelocity(opos, tpos, Magic_Speed.Low);
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
    console.log("createPlayer oid exist.", oid);
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

      tdist = Math.sqrt((magic.x - monster.x) ** 2 + (magic.y - monster.y) ** 2);
      //console.log("tdist=",tdist);
      if (tdist < dist && magic.status != Magic_Status.Hit && monster.status != Monster_Status.Atacked && magic.kind != monster.kind) {
        magic.changeStatus(Magic_Status.Hit);
        monster.changeStatus(Monster_Status.Atacked);
        monster.hp -= magic.power;
        if (monster.hp <= 0) {
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
  let tmin = 3;
  let tmax = 5;
  if (Date.now() - gMonsterCallTime < (Math.floor(Math.random() * (tmax + 1 - tmin)) + tmin) * 1000) {
    return;
  }
  //4体いる場合には追加しない。
  if (gMonsterList.length >= 15) {
    return;
  }

  //ランダムでgMonsterLibDictに入っているものから種別を決める
  // 0-100の間で各モンスターの出る確率を変化させる
  let k = 0;
  var randVal = (Math.floor(Math.random() * (100 + 1 - 0)) + 0);
  // let k = Object.keys(gMonsterLibDict)[Math.floor(Math.random() * Object.keys(gMonsterLibDict).length)];
  if (randVal > 10) {
    k = 0;
  } else {
    k = 1;
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

  let emptyList = Object.keys(gTargetPosDict).filter(function (s) {
    //console.log(existList, existList.indexOf(s));
    return existList.indexOf(s) == -1
  })

  //ランダムで空いている場所を選ぶ
  let uid = parseInt(emptyList[Math.floor(Math.random() * emptyList.length)]);

  monster.uid = uid;
  monster.x = getTargetPos(uid)[0];
  monster.y = getTargetPos(uid)[1];
  monster.changeStatus(Monster_Status.Create);

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

  fill(255);
  text('1st player', 100, 100);
  text('2nd player', 900, 100);
  text('3rd player', 100, 700);
  text('4th player', 900, 700);

  /*
  for (let i = 0; i < 4; i++) {
    createPlayer(i);
  }
  */

  //console.log("monster num",gMonsterList.length);

  //キーボードによる処理

  if (keyIsPressed == true) {


    if (key == "z") {
      gSpeakVoiceKind = 0;
    }
    if (key == "x") {
      gSpeakVoiceKind = 1;
    }
    if (key == "c") {
      gSpeakVoiceKind = 9;
    }
    if (key == "r") {
      resetScore(); // プレイヤーのスコアをリセット
    }


  }


  if (keyIsPressed == true) {
    if (key == "q") {
      if (iTestKey == false) {
        message0 = getMessageTest(0, 0); //テスト用文字列取得関数、ファイル末尾に関数定義あり
        iTestKey = true; // このiはキーボード押し続けると無限に読まれ続けてしまうから一度しか実行しないために入れてる
      } else {
        message0 = '';
      }
    }

    if (key == "w") {
      if (iTestKey == false) {
        message0 = getMessageTest(0, 1);
        iTestKey = true;
      } else {
        message0 = '';
      }


    }

  } else {
    iTestKey = false; // 最初の一回だけキーボードを押すときに文字列更新を行うための処理
  }


  if (gMessageList.isCompleted(message0)) {

    messageDisplay = message0;



    var speak = new SpeechSynthesisUtterance();

    var rateRamdom = 1;//Math.random() * 1;
    var ratePitch = 1; Math.random() * 1;
    message0.replace("\n", "");
    speak.text = message0;
    speak.rate = rateRamdom;   // 読み上げ速度 0.1-10 初期値:1 (倍速なら2, 半分の倍速なら0.5, )
    speak.pitch = ratePitch;  // 声の高さ 0-2 初期値:1(0で女性の声)

    speak.lang = 'ja-JP'; //(日本語:ja-JP, アメリカ英語:en-US, イギリス英語:en-GB, 中国語:zh-CN, 韓国語:ko-KR)
    // speak.lang = 'en-GB'; //(日本語:ja-JP, アメリカ英語:en-US, イギリス英語:en-GB, 中国語:zh-CN, 韓国語:ko-KR)

    //「イギリス人男性風の声質」のvoiceオブジェクトを取得
    var voice = speechSynthesis.getVoices().find(function (voice) {
      return voice.name === 'Google 한국의';
    });

    // 取得できた場合のみ適用する
    if (voice) {
      speak.voice = voice;
    }
    speechSynthesis.speak(speak);

    message0 = '';


  }

  fill(0);
  // text(messageDisplay, 100, 200);
  // text(convertRomanToKana(messageDisplay), 100, 300);

  //呪文の取得処理
  let keys = gMessageList.getKeyList();
  let i = 0;
  textSize(40);



  let msgTest = "amenboakaina aiueo ukimonikoebimooyioideiru";
  let msgTestKana = convertRomanToKana(msgTest);


  if (gSpeakVoiceKind == 0) {
    fill(200);
    textSize(100);
    text("にほんご", 100, 300);
    text("かんごくご", 900, 300);
    text("ヒンドゥーご", 100, 900);
    text("ｲﾝﾄﾞﾈｼｱご", 900, 900);
    
  } else if (gSpeakVoiceKind == 1) {
    fill(200);
    textSize(100);
    text("えいご(US)", 100, 300);
    text("スペインご", 900, 300);
    text("フランスご", 100, 900);
    text("イタリアご", 900, 900);
    
  } else {
    fill(200);
    textSize(100);
    text("にほんご", 100, 300);
    text("にほんご", 900, 300);
    text("にほんご", 100, 900);
    text("にほんご", 900, 900);
  }


  for (var k of keys) {
    //ou配列の0番目がOperatorID, ou配列の1番目がUnitID
    let ou = gMessageList.parseKey(k);
    let message = gMessageList.getMessage(ou[0], ou[1]);
    //console.log("message",message)
    // ext(k + " " + message, 300, 20 + 10 * i);
    let posx = 0;
    let posy = 0;
    if (ou[1] == 0) {
      posx = 50;
      posy = 100;

    } else if (ou[1] == 1) {
      posx = 900;
      posy = 100;

    } else if (ou[1] == 2) {
      posx = 50;
      posy = 700;

    } else {
      posx = 900;
      posy = 700;

    }

    if (message != '') {
      gDisplayedMsgList[k] = message;
      gDisplayedMsgKanaList[k] = convertRomanToKana(message);
    }
    fill(0);
    textSize(50);
    let j = 1;
    let init = 0;
    i = 0;
    for (i = 0; i < gDisplayedMsgList[k].length; i++) {
      if (i > 16 * j) {
        text(gDisplayedMsgList[k].slice(init, i), posx, posy + (j - 1) * 120);
        j = j + 1;
        init = i - 1;
      }
    }
    text(gDisplayedMsgList[k].slice(init, i), posx, posy + (j - 1) * 120);

    j = 1;
    init = 0;
    for (let i = 0; i < gDisplayedMsgKanaList[k].length; i++) {
      if (i > 8 * j) {
        text(gDisplayedMsgKanaList[k].slice(init, i), posx, posy + 60 + (j - 1) * 120);
        j = j + 1;
        init = i - 1;
      }
    }
    text(gDisplayedMsgKanaList[k].slice(init, i), posx, posy + 60 + (j - 1) * 120);


    //文字が改行まで届いている場合
    if (gMessageList.isCompleted(message)) {
      console.log("message completed");

      let expectedLen = gMessageList.getExpectMessageLength(ou[0], ou[1]);
      let message = gMessageList.getMessage(ou[0], ou[1]);
      console.log("operator=", ou[0], " unitid=", ou[1], " message=", message, " expected len=", expectedLen, " len=", message.length);
      message = message.toLowerCase();
      message = message.replace(/\r?\n/g, '');
      messageDisplay = message;



      var speak = new SpeechSynthesisUtterance();

      var rateRamdom = 1;//Math.random() * 1;
      var ratePitch = 1; Math.random() * 1;
      speak.text = messageDisplay;
      speak.rate = rateRamdom;   // 読み上げ速度 0.1-10 初期値:1 (倍速なら2, 半分の倍速なら0.5, )
      speak.pitch = ratePitch;  // 声の高さ 0-2 初期値:1(0で女性の声)

      speak.lang = 'ja-JP'; //(日本語:ja-JP, アメリカ英語:en-US, イギリス英語:en-GB, 中国語:zh-CN, 韓国語:ko-KR)
      // speak.lang = 'en-GB'; //(日本語:ja-JP, アメリカ英語:en-US, イギリス英語:en-GB, 中国語:zh-CN, 韓国語:ko-KR)

      if (gSpeakVoiceKind == 0) {
        fill(200);
        textSize(100);
        text("にほんご", 100, 300);
        text("かんごくご", 900, 300);
        text("ヒンドゥーご", 100, 900);
        text("インドネシアご", 900, 900);
        if (ou[1] == 0) {
          var voice = speechSynthesis.getVoices().find(function (voice) {
            return voice.name === 'Google 日本語';
          });
        } else if (ou[1] == 1) {
          var voice = speechSynthesis.getVoices().find(function (voice) {
            return voice.name === 'Google 한국의';
          });
        } else if (ou[1] == 2) {
          var voice = speechSynthesis.getVoices().find(function (voice) {
            return voice.name === 'Google हिन्दी';
          });
        } else {
          var voice = speechSynthesis.getVoices().find(function (voice) {
            return voice.name === 'Google Bahasa Indonesia';
          });
        }
      } else if (gSpeakVoiceKind == 1) {
        fill(200);
        textSize(100);
        text("えいご(US)", 100, 300);
        text("スペインご", 900, 300);
        text("フランスご", 100, 900);
        text("イタリアご", 900, 900);
        if (ou[1] == 0) {
          var voice = speechSynthesis.getVoices().find(function (voice) {
            return voice.name === 'Google US English';
          });
        } else if (ou[1] == 1) {
          var voice = speechSynthesis.getVoices().find(function (voice) {
            return voice.name === 'Google español';
          });
        } else if (ou[1] == 2) {
          var voice = speechSynthesis.getVoices().find(function (voice) {
            return voice.name === 'Google français';
          });
        } else {
          var voice = speechSynthesis.getVoices().find(function (voice) {
            return voice.name === 'Google italiano';
          });
        }
      } else {
        var voice = speechSynthesis.getVoices().find(function (voice) {
          return voice.name === 'Google 日本語';
        });
      }




      // 取得できた場合のみ適用する
      if (voice) {
        speak.voice = voice;
      }
      speechSynthesis.speak(speak);

      message0 = '';

      //呪文を発動したら、改行までのメッセージを削除する。
      gMessageList.deleteMessage(ou[0], ou[1]);
    }
    i++;
  }


  //モンスターの表示
  // for (var monster of gMonsterList) {
  //   monster.draw();
  // }

  //プレーヤーの表示→表示順番のため下部に移動
  //  for (var player of gPlayerList) {
  //    player.draw();
  //  }

  //マジックの表示
  /*
  for (var magic of gMagicList) {
    magic.draw();
  }
  */
  //属性がNoneものものは削除する
  gMagicList = gMagicList.filter(n => n.status !== Magic_Status.None);
  gMonsterList = gMonsterList.filter(n => n.status !== Monster_Status.None);
  //console.log("magiclength=",gMagicList.length, "monster length=",gMonsterList.length);

  //デバック文の表示
  if (gTestFg) {
    // text("[Debug]\n oid=" + gTestOid + " \n uid=" + gTestUid + "\n message=" + gTestMessageList[gTestMessageIndex], 10, 20);
  }

  //当たり判定確認
  // checkHit();

  //モンスターを召喚する。
  // callMonster();

  // プレイヤーポイント・メッセージ表示枠を表示、モンスターよりも上に表示するためにcallMonster()よりも下に書く
  /*
  image(gBackPointImg, 0, 0);
  for (var player of gPlayerList) {
    player.draw();
  }
  */

  /*if(!gSoundFire.isPlaying()){
    gSoundFire.play();
  }*/
}



// 引数説明
// in1: 0固定
// in2: 受光ユニットID(0~3)
function getMessageTest(in1, in2) {

  if ((in1 == 0) && (in2 == 0)) {
    return 'moziretu jukou1 kara\n'
  } else if ((in1 == 0) && (in2 == 1)) {
    return 'mukashimukasiarutokoronioziisanntoobaasangaimashita\n'
  } else {
    return 'moziretu erusu\n'
  }
}