// 参考URL: https://qiita.com/youtoy/items/c98c0996458a21fc1e67

const UUID_UART_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const UUID_TX_CHAR_CHARACTERISTIC = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
let myCharacteristics;

async function onStartButtonClick() {
  try {
    console.log("Requesting Bluetooth Device...");
    const device = await navigator.bluetooth.requestDevice({
      filters: [
        { services: [UUID_UART_SERVICE] },
        { namePrefix: "BBC micro:bit" },
      ],
    });

    console.log("Connecting to GATT Server...");
    const server = await device.gatt.connect();
    console.log("Getting Service...");
    const service = await server.getPrimaryService(UUID_UART_SERVICE);
    console.log("Getting Characteristic...");
    myCharacteristics = await service.getCharacteristic(UUID_TX_CHAR_CHARACTERISTIC);
    myCharacteristics.startNotifications();
    console.log("> Notifications started");
    myCharacteristics.addEventListener("characteristicvaluechanged", handleNotifications);
  } catch (error) {
    console.log("Argh! " + error);
  }
}

async function handleNotifications(event) {

  if (myCharacteristics) {
    try {
      const value = event.target.value;
      const inputValue = new TextDecoder().decode(value).replace(/\r?\n/g, '');
      switch (inputValue) {
        case "buttonA":
          console.log(`Aボタンが押されたよ`);
          stockCurrentColorMicrobit();
          break;
        case "buttonB":
          console.log(`Bボタンが押されたよ`);
          break;
        case "left":
          console.log(`左に傾いたよ`);
          break;
        case "right":
          console.log(`右に傾いたよ`);
          break;
        default:
          let packet = new Packet();
          //ノイズ除去のために、operatorとunitidを絞る。文字コードも絞る。
          if(packet.rawToPacket(inputValue)==0&&(packet.operatorId<20)&&(packet.unitId<20)&& packet.data.charCodeAt(0) < 128 ){
            console.log("recv ", inputValue)
            gMessageList.addPacket(packet);
            //console.log(gMessageList.getMessage(packet.operatorId, packet.unitId));
          }
      }
    } catch (error) {
      console.log("Argh! " + error);
    }
  }
}