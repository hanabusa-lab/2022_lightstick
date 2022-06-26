class Packet {  

  //受信データを解析する。
  rawToPacket(rawData){
    //文字チェック 0x0000 0000 0000 or 0x0000 0000 
    if(!(rawData.length == 10 || rawData.length == 14)){
      console.log("Packet error.", rawData);
      return -1;
    }
    
    //0xから始まるかの確認
    if(rawData.substr(0,2)!="0x"){
      console.log("Packet error.", rawData.substr(0,2), rawData);
      return -1;
    }
    
    //charaの取得
    let ascii = parseInt(rawData.substr(0,6), 16) 
    this.data = String.fromCharCode(ascii);

    //文字長さの取得
    this.length = 0;
    this.length = parseInt(rawData.substr(6,2));
    
    //オペレータIDの取得
    this.operatorId = parseInt(rawData.substr(8,2));
    //console.log("debug", rawData.substr(10,4))
    
    //ユニットIDの取得
    this.unitId = 0;
    if(rawData.length == 14){
      this.unitId = parseInt(rawData.substr(10,4));
    }
    console.log("rawToPacket", rawData, ascii, this.data, this.length, this.operatorId, this.unitId);

    return 0;
  }

  //改行かの確認
  isEndPacket(){
    if(this.data=="\n"){
      return true;
    }else{
      return false;
    }
  }
}

class MessageList {
    
    constructor(){
      this.map = new Map();
      //mapの中には、key(オペレータIDとユニットID)とした、文字列が含まれている。文字列は、複数持つことができ、改行で区切られる。各々の文字列の先頭には、"文字数:"が含まれる。
    }

    //受信した文字(文字、オペレーション、場所含む)を追加する
    addPacket(packet){
      let key = String(packet.operatorId)+","+String(packet.unitId);
      
      if(this.map.has(key)){
        let value = this.map.get(key)
        //前の値が改行で、本言葉が新しい文字なら、文字数を追加する。
        if(value.slice(-1)=='\n'){
          this.map.set(key, value+packet.length+":"+packet.data);
        }else
          this.map.set(key, value+packet.data);    
      }else{
        this.map.set(key, packet.length+":"+packet.data);
      }
    }

    //keyのリストを取得する。
    getKeyList(){
      let list = []
      for (let key of this.map.keys()){
        list.push(key);
        //console.log("key", key)
      } 
      return list;
    }

    //keyからoperatorIdと、unitIdの値を取得する。
    parseKey(key){
      //console.log("parseKey start", key);
      let pKey = []
      try {
        //"keyは0,1などのように,がデリミタとなっている"
        let oId = parseInt(key.slice(0, key.indexOf(",")));
        //console.log("oId",oId, key.indexOf(","), key.length)         
        //let length = parseInt(key.slice(key.indexOf(",")+1, key.indexOf(",")));

        let uId = parseInt(key.slice(key.indexOf(",")+1, key.length));

        //console.log("uId",uId, key.indexOf(",")+1, key.length)
        //console.log("parseKey",key, oId, uId)
        pKey = [oId, uId];    
      } catch (error){
        console.log("error")
      }  
      return pKey;
    }
    //バッファーに溜まっている文字列を取得する。
    //改行まで含まれている場合には、改行まで含んで返信する。
    getMessage(operatorId, unitId){
      let key = String(operatorId)+","+String(unitId);
      let value = "";
      if(this.map.has(key)){
        value = this.map.get(key);
        //lenが含まれている場合には、それ以降を取得する。
        if(value.indexOf(':')>0){
          value = value.slice(value.indexOf(':')+1,value.length); 
        }
        //console.log("index",value.indexOf('\n'))
        if(value.indexOf('\n')>0){
          value = value.slice(0, value.indexOf('\n')+1);
        }
        //this.map.delete(key);
      }
      return value;
    }

    //送信予定のメッセージの長さを取得する。
    //異常な場合には-1を返す。
    //複数の文字列が含まれている場合でも、最初の文字数を返す。
    getExpectMessageLength(operatorId, unitId){
      let spos =0;
      let epos =0;
      let key = String(operatorId)+","+String(unitId);
      let length = 0;
     
      //項目がないときは、-1を返す。
      if(!this.map.has(key)){
        return -1;
      }
      let value = this.map.get(key);
      epos = value.indexOf(":");
      if(epos < 0){
        return -1;
      }
      //改行が文字長さの前にある場合は、改行から:までの間に文字長がある。
      if(value.indexOf('\n') < epos){
        length = value.slice(value.indexOf('\n')+1, epos);
      }else{
        //改行がない場合には、先頭に文字長さがあり。
        length = value.slice(0, epos);
      }
      return length;
    }

    //メッセージが改行まで完結しているかを確認する。
    isCompleted(message){
      //改行を含んでいたら完結している
      if(message.indexOf('\n')>=0){
        return true;
      }else{
        return false;
      }
    }
    //指定されたoperatorIdと、unitIdのmessageを削除する。
    //複数のmessageがあったら、最初のメッセージのみを削除する。
    //改行を含んでいない場合には、全メッセージを削除する。
    deleteMessage(operatorId, unitId){
      let key = String(operatorId)+","+String(unitId);
      //console.log("deleteMessage")
      if(this.map.has(key)){
        let value = this.map.get(key);
        if(value==null){
          return;
        }
        //console.log("deleteMessage value=",value);
        if(value.indexOf('\n')>0){
          //console.log("deleteMessage index", value.indexOf('\n'))
          let vlength =value.length;
          value = value.slice(value.indexOf('\n'), vlength);
          //console.log("deleteMessage value", value, "end")
     
          this.map.set(key, value);
          //if(value.indexOf('\n')>0){
          //  deleteMessage(operatorId, unitId);
          //}
        }else{
          this.map.delete(key);
        }
      }
    }
}

//MessageListクラスのテスト関数
function testMessageList(){
  
  console.log("testMessageList")
  let packet = new Packet();
  let messageList = new MessageList();
  
  //パケット追加のテスト
  packet.rawToPacket("0x004103020004");
  messageList.addPacket(packet);
  
  packet.rawToPacket("0x004203020004");
  messageList.addPacket(packet);
  
  packet.rawToPacket("0x004303020004");
  messageList.addPacket(packet);
  
  //メッセージ取得
  console.log("getMessageWoN", messageList.getMessage(packet.operatorId, packet.unitId),messageList.getExpectMessageLength(packet.operatorId, packet.unitId),messageList.getMessage(packet.operatorId, packet.unitId).length)
  
  //改行""0a"のテスト
  packet.rawToPacket("0x000a00020004");
  messageList.addPacket(packet);
  
  console.log("getMessageWN", messageList.getMessage(packet.operatorId, packet.unitId), messageList.getExpectMessageLength(packet.operatorId, packet.unitId),messageList.getMessage(packet.operatorId, packet.unitId).length)
  
  //改行後の追加
  //packet.rawToPacket("0x004300020004");
  packet.rawToPacket("0x004303020004");
  messageList.addPacket(packet);
  console.log("getMessageWN2", messageList.getMessage(packet.operatorId, packet.unitId), messageList.getExpectMessageLength(packet.operatorId, packet.unitId),messageList.getMessage(packet.operatorId, packet.unitId).length)
  
  //削除テスト。改行までを削除。
  messageList.deleteMessage(packet.operatorId, packet.unitId);
  console.log("getMessage delete1", messageList.getMessage(packet.operatorId, packet.unitId), messageList.getExpectMessageLength(packet.operatorId, packet.unitId),messageList.getMessage(packet.operatorId, packet.unitId).length)
  
  messageList.deleteMessage(packet.operatorId, packet.unitId);
  console.log("getMessage delete2", messageList.getMessage(packet.operatorId, packet.unitId), messageList.getExpectMessageLength(packet.operatorId, packet.unitId),messageList.getMessage(packet.operatorId, packet.unitId).length)
  
  //messageList.deleteMessage(packet.operatorId, packet.unitId);
  //console.log("getMessage delete3", messageList.getMessage(packet.operatorId, packet.unitId), messageList.getMessage(packet.operatorId, packet.unitId).length)
  
  packet.rawToPacket("0x004300030003");
  messageList.addPacket(packet);
  

  let keys = messageList.getKeyList();
  console.log(keys, keys[0]);
  let parse = messageList.parseKey(keys[0]);
  console.log("parse", parse)



}