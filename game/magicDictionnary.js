
var fireDictionary = [
    'fire',
    'explotion',
    'hi',
    'honoo', 'hono',
    'kazi', 'kasai',
    'kaennhousya', 'kaenhousya',
    'daimonnzi', 'daimonzi',
    'ekusupuro-jonn', 'ekusupuro-jonn',
    'kaenn', 'kaenn',
    'furea', 'syouen',
    'bakuen', 'netu',
    'sekinetu', 'homura',
    'nennsyou', 'kagaribi',
    'kaennsennpu', 'kaenndama',
    'kaennboku', 'suika',
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
    'kototu',
    'matti',
    'yougann','yougan',
    'zyuu',
    'aruko-rurannpu','arukoーrurannpu',
    'rannpu','ranpu',
    'ennzinn','enzin',
    'huraipann','huraipan',
    'yamakazi',//火山
    '000\n',
    'furo', 'ofuro',
    'kare-',
    'hanabi',
    'kyanpufaiya-', 'kyannpufaiya-', 'kyanpuhpaiya-', 'kyannpuphaiya-',
    'kyanpufaia-', 'kyannpufaia-', 'kyanpuhpaia-', 'kyannpuphaia-'

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
    'naminori', 'nami',
    'takinobori',
    'fubuki',
    'arashi', 'arasi',
    'saigai',
    'teppoumizu',
    'suiun',
    'suika',//水火
    'suigou',
    'suiun',
    'muzube',
    'suigetu',
    'kawa', 'kasen',
    'umi',
    'kigasu', 'mokugasu',
    'suiatu',
    'suii',
    'suitou',
    'mizukemuri',
    'mizuoto',
    'mizusimo',
    'mizumawari',
    'suigai',
    'gekiryuu',
    'rinnkanngakkou',
    'sakana',
    'fish',
    'nettaigyo',
    'daikouzui',
    'mizuhuusenn','mizuhuusen',
    'reitou',
    'kaitou',
    'sake',
    'same',
    'medaka',
    'kame',
    'pu-ru',
    'furo', 'ofuro',
    'mizuame',
    'kingyosukui', 'kingyosukui',
    'mizufuusenn', 'mizufuusen',
    'mizudeppou',
    'penki',
    'mizugi',
    'go-guru',
    'umi',
    'taiheiyou',
    'taiesiyou',
    'inndoyou',
    'biwako',
    'suke-to',
    'kakigoori',
    'same',
    'syumokuzame',
    'hannma-heddosya-ku',
    'kame',


]

var woodDictionary = [
    'wood',
    'ki',
    'hayashi',
    'mori',
    'arashi', 'arasi',
    'saigai',
    'kaennboku',
    'suika',//スイカ
    'fuurinnkazan',
    'sinnrabannsyou',
    'bokuzin',
    'mokugyo',
    'bokutou', 'sinai',
    'mokuzou',
    'hasi',
    'sougen',
    'yamakazi',
    'kigasu', 'mokugasu',
    'koppamizin',
    'kokage',
    'kuwomitemoriwomizu',
    'kyuuri',
    'komorebi',
    'mokkan',
    'suitou',
    'yama',
    'tukue',
    'isu',
    'kyannpufaia-',
    'kiyannpu',
    'rinnkaigakkou',
    'yasai',
    'asagao',
    'kogarashi','kagarasi',
    'zisinn','zishinn','zisin',
    'yamakazi',
    'dosyakyzure',
    'taihuu',
    'happa',
    'sennpuuki',
    'tannpopo',
    'toumorokosi','toumorokoshi',
    'yamakazi',//火山
    'ha',
    'mushi', 'musi',
    'kikori',
    'funka',
    'kyanpufaiya-', 'kyannpufaiya-', 'kyanpuhpaiya-', 'kyannpuphaiya-',
    'kyanpufaia-', 'kyannpufaia-', 'kyanpuhpaia-', 'kyannpuphaia-',
    'sougen', 'sougenn',
    'pikunikku', 
    'haikinngu', 'haikingu',
    'sakura', 
    'hanami'
    
]


function searchMagicDctinary(message) {
    let fireResult;
    let waterResult;
    let woodResult;


    if (fireDictionary.indexOf(message) != -1) {
        // fireResult = convertRomanToKana(message).length;
        fireResult = (message).length;
    } else {
        fireResult = -1;
    }
    if (waterDictionary.indexOf(message) != -1) {
        // waterResult = convertRomanToKana(message).length;
        waterResult = (message).length;
    } else {
        waterResult = -1;
    }
    if (woodDictionary.indexOf(message) != -1) {
        // woodResult = convertRomanToKana(message).length;
        woodResult = (message).length;
    } else {
        woodResult = -1;
    }

    return [fireResult, waterResult, woodResult];
}