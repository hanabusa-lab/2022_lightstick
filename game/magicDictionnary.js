
var fireDictionary = [
    'fire',
    'explotion',
    'hi',
    'honoo', 'hono',
    'kazi',
    'kaennhousya', 'kaenhousya',
    'daimonnzi', 'daimonzi',
    'ekusupuro-jonn','ekusupuro-jonn' 

]

var waterDictionary = [
    'water',
    'ice',
    'mizu',
    'haidoroponnpu', 'haidoroponpu',
    'mizudeppou',
    'daikouzui',
    'nettou',
    'reitoubi-mu',
    'naminori',
    'takinobori',
    'fubuki',
    'arashi',
    'saigai'
]

var woodDictionary =[
    'wood',
    'ki',
    'hayashi',
    'mori',
    'arashi',
    'saigai'
]


function searchMagicDctinary(message){
    let fireResult;
    let waterResult;
    let woodResult;

    if ( fireDictionary.indexOf(message) != -1) {
        fireResult = message.length;
    }else {
        fireResult = -1;
    }
    if ( waterDictionary.indexOf(message) != -1) {
        waterResult = message.length;
    }else {
        waterResult = -1;
    }
    if ( woodDictionary.indexOf(message) != -1) {
        woodResult = message.length;
    }else {
        woodResult = -1;
    }

    return [fireResult, waterResult, woodResult];
}