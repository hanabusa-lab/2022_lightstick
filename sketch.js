// import {SystemManager} from './SystemManager.js'


const barWidth = 20;
let lastBar = -1;

let font,
  fontsize = 32;

let imageQuestion1;
let imageQuestion2;
let imageQuestion3;
let imageQuestion4;
let imageQuestion5;

let i = 0;

//表示モンスター
let monster1=new Monster();
let monster1_img=null;
let img=null;



// const { webFrame } = require('electron')
// webFrame.registerURLSchemeAsPrivileged('file')





function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  // font = loadFont('assets/SourceSansPro-Regular.ttf');
  //font = loadFont('assets/keifont.ttf');
  frameRate(30);
  img = loadImage("assets/Q1.jpg");
  monster1.setImage(img); 
}

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES); 
    
}

//let systemManager = new SystemManager;

function draw() {
    //背景の塗りつぶし
    background(0); 
    fill(255);
    textSize(12);
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
    monster1.draw();
    monster1.scale=0.1;
    monster1.angle+=0.1;
    
  //systemManager.executeSystem();
}



