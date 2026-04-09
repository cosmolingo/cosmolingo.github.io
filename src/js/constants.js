const base_url = 'https://cosmolingo.studio';
let words_list = [];
let shuffled_list = [];
let shuffled_list2 = [];
let game_done = false;
let game_timeout = 0;
let tag_list = [];
let guess_index = 0;
let correct_guesses = 0;
let total_guesses = 0;
let correct_associations = 0;
let total_associations = 0;
let wordle_word = '';
let worlde_word_en = '';
let wordle_active_row = 0;
let wordle_last_word_idx = 0;
const letter_duration = new Array(100).fill(0);
const nb_outfits = 6;
let rand_outfit_i = Math.floor(Math.random() * nb_outfits) + 1;

const languages = ['kazakh','russian','french','korean','japanese'];
const colors = [['#7db1db','#5092c8'],['#ffb361','#ff9829'],['#c499e0','#a463ce'],['#f2e269','#e3b713'],['#e8766d','#d7544a']];

const ka_lat_alphabet = [
    "a","ä","b","v","g","R","d","é","j","z","i","I","k","K","l","m","n","N","o","ö","p","r","c","t","ou","ô","eu","f","h","H","ts", "ch", "sh","SH","è", "y","ae","yu","ya"
];
const pron_alphabets = [
    ["а","ә","б","в","г","ғ","д","е","ж","з","и","й","к","қ","л","м","н","ң","о","ө","п","р","с","т","у","ұ","ү","ф","х","һ","ц","ч","ш","щ","ы","і","э","ю","я"],
    ["а","б","в","г","д","е","ё","ж","з","и","й","к","л","м","н","о","п","р","с","т","у","ф","х","ц","ч","ш","щ","ъ","ы","ь","э","ю","я"],
    ["a","an","b","ch","d","e","é","è","eu","f","g","i","in","j","k","l","m","n","o","oa","on","ou","p","r","s","t","u","v","x","y","z"],
    [],
    []
];
let palette = [
    ['red',0,100,100],
    ['orange',33,100,100],
    ['brown',40,100,60],
    ['yellow',55,100,100],
    ['green',115,100,100],
    ['cyan',175,100,100],
    ['blue',230,100,100],
    ['purple',285,100,75],
    ['pink',320,55,100],
    ['red',360,100,100],
    ['white',0,0,100],
    ['gray',0,0,50],
    ['black',0,0,0]
];

const special_numbers = [
    {0:'нөл',1:'бір',2:'екі',3:'үш',4:'төрт',5:'бес',6:'алты',7:'жеті',8:'сегіз',9:'тоғыз',10:'он',
    20:'жиырма',30:'отыз',40:'қырық',50:'елу',60:'алпыс',70:'жетпіс',80:'сексен',90:'тоқсан',100:'жүз',1000:'мың'},
    {},
    {0:'zéro',1:'un',2:'deux',3:'trois',4:'quatre',5:'cinq',6:'six',7:'sept',8:'huit',9:'neuf',10:'dix',
    11:'onze',12:'douze',13:'treize',14:'quatorze',15:'quinze',16:'seize',17:'dix-sept',18:'dix-huit',19:'dix-neuf',
    20:'vingt',30:'trente',40:'quarante',50:'cinquante',60:'soixante',70:'soixante-dix',80:'quatre-vingts',90:'quatre-vingt-dix',100:'cent',1000:'mille'},
    {},
    {}
];

const days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
const months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
const seasons = ["winter","spring","summer","autumn"];

const weather_types = {
    clear:{src:'clear-day',en_name:'clear'},
    pcloudy:{src:'partly-cloudy-day',en_name:'cloudy'},
    mcloudy:{src:'overcast-day',en_name:'cloudy'},
    cloudy:{src:'cloudy',en_name:'cloudy'},
    humid:{src:'fog',en_name:'humid'},
    lightrain:{src:'overcast-drizzle',en_name:'rain'},
    oshower:{src:'overcast-day-rain',en_name:'rain'},
    ishower:{src:'overcast-rain',en_name:'rain'},
    lightsnow:{src:'overcast-day-snow',en_name:'snow'},
    rain:{src:'rain',en_name:'rain'},
    snow:{src:'snow',en_name:'snow'},
    rainsnow:{src:'sleet',en_name:'rain & snow'},
    ts:{src:'thunderstorms',en_name:'thunderstorms'},
    tsrain:{src:'thunderstorms-rain',en_name:'thunderstorms'},
};

const clock_intro = ['сағат','время','il est','시간','japanese "il est"'];
const hour_suffixes_1 = {
    0:'',1:'ден',2:'ден',3:'тен',4:'тен',5:'тен',6:'дан',7:'ден',8:'ден',9:'дан',10:'нан',11:'ден',12:'ден'
};
const hour_suffixes_2 = {
    0:'',1:'ге',2:'ге',3:'ке',4:'ке',5:'ке',6:'ға',7:'ге',8:'ге',9:'ға',10:'ға',11:'ге',12:'ге'
};

let section = '';
let lang_to_en = true;