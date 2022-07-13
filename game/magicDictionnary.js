
var fireDictionary = [
    'fire',
    'explotion',
    'hi',
    'honoo', 'hono',
    'kazi','kasai',
    'kaennhousya', 'kaenhousya',
    'daimonnzi', 'daimonzi',
    'ekusupuro-jonn','ekusupuro-jonn' ,
    'kaenn','kaenn',
    'furea','syouen',
    'bakuen','netu',
    'sekinetu','homura',
    'nennsyou','kagaribi',
    'kaennsennpu','kaenndama',
    'kaennboku','suika',
    'fuurinnkazan',
    'yamakazi',
    'hinoumi',
    'hinomoto',
    'hinokuruma',
    'hinotori',
    'hinoko',
    'hibana',
    'kagiroi',
    'hizeme',
    'himaturi',
    'kazan',
    'hinawazyuu',
    'kanetu',
    'kayaku',
    'hiasobi',
    'karoku',
    'karinn',
    'kototu'

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
    'naminori','nami',
    'takinobori',
    'fubuki',
    'arashi',
    'saigai',
    'teppoumizu',
    'suiun',
    'suika',//水火
    'suigou',
    'suiun',
    'muzube',
    'suigetu',
    'kawa','kasen',
    'umi',
    'kigasu','mokugasu',
    'suiatu',
    'suii',
    'suitou',
    'mizukemuri',
    'mizuoto',
    'mizusimo',
    'mizumawari',
    'suigai'
]

var woodDictionary =[
    'wood',
    'ki',
    'hayashi',
    'mori',
    'arashi',
    'saigai',
    'kaennboku',
    'suika',//スイカ
    'fuurinnkazan',
    'sinnrabannsyou',
    'bokuzin',
    'mokugyo',
    'bokutou','sinai',
    'mokuzou',
    'hasi',
    'sougen',
    'yamakazi',
    'kigasu','mokugasu',
    'koppamizin',
    'kokage',
    'kuwomitemoriwomizu',
    'kyuuri',
    'komorebi',
    'mokkan',
    'suitou'
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