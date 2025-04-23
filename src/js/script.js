//TODO:
//Spatial preposition
//Past tense table
//To be table
//Food (Fruits & Vegetables)
//Animals
//German
//Way to do the guessing game on a subset of all words

//TIPS:
//for diagrams, include a line at 0,0 and copy it with each part so that you copy the absolute position and not relative like illustrator does

var base_url = 'https://cosmolingo.social';
var words_list = [];
var shuffled_list = [];
var shuffled_list2 = [];
var game_done = false;
var game_timeout = 0;
var tag_list = [];
var guess_index = 0;
var correct_guesses = 0;
var total_guesses = 0;
var correct_associations = 0;
var total_associations = 0;
var wordle_word = '';
var worlde_word_en = '';
var wordle_active_row = 0;
var wordle_last_word_idx = 0;
var letter_duration = new Array(100).fill(0);
var nb_outfits = 6;
var rand_outfit_i = Math.floor(Math.random() * nb_outfits) + 1;


var languages = ['kazakh','russian','french','korean','japanese'];
var colors = [['#7db1db','#5092c8'],['#ffb361','#ff9829'],['#c499e0','#a463ce'],['#f2e269','#e3b713'],['#e8766d','#d7544a']];
var alphabets = [
    ["а","ә","б","в","г","ғ","д","е","ж","з","и","й","к","қ","л","м","н","ң","о","ө","п","р","с","т","у","ұ","ү","ф","х","һ","ц","ч","ш","щ","ы","і","э","ю","я"],
    ["а","б","в","г","д","е","ё","ж","з","и","й","к","л","м","н","о","п","р","с","т","у","ф","х","ц","ч","ш","щ","ъ","ы","ь","э","ю","я"],
    ["a","b","c","d","e","é","è","ê","ë","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"],
    [],
    []
];
var pron_alphabets = [
    ["а","ә","б","в","г","ғ","д","е","ж","з","и","й","к","қ","л","м","н","ң","о","ө","п","р","с","т","у","ұ","ү","ф","х","һ","ц","ч","ш","щ","ы","і","э","ю","я"],
    ["а","б","в","г","д","е","ё","ж","з","и","й","к","л","м","н","о","п","р","с","т","у","ф","х","ц","ч","ш","щ","ъ","ы","ь","э","ю","я"],
    ["a","an","b","ch","d","e","é","è","eu","f","g","i","in","j","k","l","m","n","o","oa","on","ou","p","r","s","t","u","v","x","y","z"],
    [],
    []
];
var palette = [
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
]

var special_numbers = [
    {0:'нөл',1:'бір',2:'екі',3:'үш',4:'төрт',5:'бес',6:'алты',7:'жеті',8:'сегіз',9:'тоғыз',10:'он',
    20:'жиырма',30:'отыз',40:'қырық',50:'елу',60:'алпыс',70:'жетпіс',80:'сексен',90:'тоқсан',100:'жүз',1000:'мың'},
    {},
    {0:'zéro',1:'un',2:'deux',3:'trois',4:'quatre',5:'cinq',6:'six',7:'sept',8:'huit',9:'neuf',10:'dix',
    11:'onze',12:'douze',13:'treize',14:'quatorze',15:'quinze',16:'seize',17:'dix-sept',18:'dix-huit',19:'dix-neuf',
    20:'vingt',30:'trente',40:'quarante',50:'cinquante',60:'soixante',70:'soixante-dix',80:'quatre-vingts',90:'quatre-vingt-dix',100:'cent',1000:'mille'},
    {},
    {}
]

var days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
var months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
var seasons = ["winter","spring","summer","autumn"];

var weather_types = {
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

var clock_intro = ['сағат','время','il est','시간','japanese "il est"'];
var hour_suffixes_1 = {
    0:'',1:'ден',2:'ден',3:'тен',4:'тен',5:'тен',6:'дан',7:'ден',8:'ден',9:'дан',10:'нан',11:'ден',12:'ден'
};
var hour_suffixes_2 = {
    0:'',1:'ге',2:'ге',3:'ке',4:'ке',5:'ке',6:'ға',7:'ге',8:'ге',9:'ға',10:'ға',11:'ге',12:'ге'
}
var lang_params = ['ka','ru','fr','kr','jp'];
var lang_i = 0;
var section = '';
var lang_to_en = true;

$('#guess_game_lang_check').on('change', function() {
    if ($(this).is(':checked')) {
        lang_to_en = true;
    } else {
        lang_to_en = false;
    }
});

$(document).ready(function(){
    section = getUrlParameter('section');
    if (window.location.pathname.endsWith("index.html")) {
        const newPath = window.location.pathname.replace("index.html", "");
        const newUrl = window.location.origin + newPath + window.location.search + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
    }

    var url_lang = getUrlParameter('lang');
    if (url_lang != false){
        lang_i = lang_params.indexOf(url_lang);
        if (lang_i == -1){
            lang_i = 0;
        }
        setup_all();
    }
    else{
        var url = '/php/get_user_info.php';
        $.get(url).then(function(data){
            lang_i = lang_params.indexOf(data.default_lang);
            if (lang_i == -1){
                lang_i = 0;
            }
            setup_all();
        });
    }
});

function setup_all(){
    $('.test_clock').clockTimePicker();
    //Change theme color depending on the language
    document.documentElement.style.setProperty("--primary-color", colors[lang_i][0]);
    document.documentElement.style.setProperty("--secondary-color", colors[lang_i][1]);
    $('#wave_top path').attr('style','stroke: none;fill: '+colors[lang_i][0]+';');
    $('#wave_bottom path').attr('style','stroke: none;fill: '+colors[lang_i][0]+';');
    $('#title h1').html('<i class="' + languages[lang_i] + '" ></i>   my <div id=title_dropdown active="false">' + languages[lang_i] + '<i class="fa-solid fa-sort-down"></i></div> words   <i class="' + languages[lang_i] + '" ></i>');
    $('link[rel="icon"]').attr('href', base_url + '/src/symbols/' + languages[lang_i] + '.ico');//TODO : add japanese icon (ask ziyu)
    //Populate grammar section based on language
    var url = "/sections/" + languages[lang_i] + ".html";	
    $.get({url: url,cache: false}).then(function(data) {
        var lines = data.split('\n');
        lines.splice(0,16);
        lines.splice(-2,2);
        data = lines.join('\n');

        $('#grammar .section_content').html(data);
        $('.game_section').detach().appendTo('#games .section_content');
        //$('.main_section').detach().appendTo('#main');
        if ($('.grammar_section').length == 0){
            $('#grammar').remove();
        }
        //Get word list and populate words section
        get_words();
        populate_numbers();
        $('#number_output p').text(special_numbers[lang_i][0]);
        setup_renderer();
        setup_toys();
        $('#title_dropdown').click(function(){
            var is_toggle_active = $('#title_dropdown').attr('active');
            if (is_toggle_active == 'false'){
                $('#flags_div').animate({top: '70px'}, 200);
                $('#title_dropdown').attr('active','true');
            }
            else{
                $('#flags_div').animate({top: '0px'}, 200);
                $('#title_dropdown').attr('active','false');
            }
        });
        $('#nav_words').click(function(){
            $('html, body').animate({
                scrollTop: $("#search_bar_div").offset().top
            }, 1000);
        });
        $('#nav_grammar').click(function(){
            $('html, body').animate({
                scrollTop: $("#grammar").offset().top
            }, 1000);
        });
        $('#nav_games').click(function(){
            $('html, body').animate({
                scrollTop: $("#games").offset().top
            }, 1000);
        });
    });
    
    var url = base_url + "/src/symbols/mascot.svg";
    $('#mascot_div').load(url);
};

function get_most_mistakes_word_list(){
    var sorted_list = [...words_list].map(word => {
        let ratio;
        if (word.occs === 0 && word.occs_ok === 0) {
            ratio = 0.0;
        }
        else if (word.occs === -1 && word.occs_ok === -1) {
            ratio = 0.0;
        }
        else {
            ratio = (1.0 + word.occs_ok) / (1.0 + word.occs);
        }
        return { ...word, ratio: ratio };
    }).sort((a, b) => a.ratio - b.ratio);
    
    let grouped = sorted_list.reduce((acc, word) => {
        acc[word.ratio] = acc[word.ratio] || [];
        acc[word.ratio].push(word);
        return acc;
    }, {});

    let final_list = Object.entries(grouped)
    .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
    .flatMap(([_, group]) => shuffleArray(group)); 
    return final_list;
}

function add_xp_word(word,is_ok){
    var url = "/php/add_occurence.php";
    $.post(url, {
        word:word,
        is_ok:is_ok
    });
    set_xp_nav();
}

function setup_toys(){
    $('.game_section').hide();
    $('.game_section').each(function(index){
        var name = $(this).children('h3').text();
        var div = $('<div>');
        div.addClass('button');
        div.attr('active',false);
        div.text(name);
        div.click(function(){
            $('.game_section').hide();
            if ($(this).attr('active') == 'true'){
                $('#games .section_content ').attr('active',false);
                $(this).attr('active',false);
            }
            else{
                $('.game_section h3:contains("' + name + '")').parent().show();   
                $('#games .section_content .button').attr('active',false);
                $(this).attr('active',true);
            }
        });
        $('#games .section_content .section_buttons').prepend(div);
    });
    $('#games .section_content .section_buttons .button:last').click();
}

function setup_tenses(){
    if ($('.tense_buttons').length == 0){
        return;
    }
    $('.tense_buttons .button').each(function(){
       $(this).click(show_hide_tense_tables); 
    });
    $('.tense_buttons .button[tense="present"]').each(show_hide_tense_tables);
}

function show_hide_tense_tables(){
    $('.tense_buttons .button').each(function(){
        $(this).attr('active','false');
    });
    $(this).attr('active','true');
    var tense = $(this).attr('tense');
    $('.tenses .content h3').text($(this).text());
    $('.tense_table').each(function(){
        if ($(this).hasClass(tense)){
            $(this).show();
        }
        else{
            $(this).hide();
        }
    });
}

function populate_weather(){
    if ($('.weather').length == 0){
        return;
    }
    $.get( "https://www.7timer.info/bin/civillight.php?lon=2.4&lat=48.9&ac=0&unit=metric&output=json&tzshift=0", function( data ) {
        var weather = JSON.parse(data)['dataseries'];
        for (var i = 0; i < 7; i++){
            var weather_type = weather[i]['weather'];
            var weather_type = weather_types[weather_type]['src'];
            var weather_name = weather_types[weather[i]['weather']]['en_name'];
            var translated_name = translate_word(weather_name);
            var weather_temp_min = weather[i]['temp2m']['min'];
            var weather_temp_max = weather[i]['temp2m']['max'];
            var div = $('<div>');
            div.addClass('weather_day');
            var p = $('<p class="weather_n_day">');
            if (i == 0){
                var trans_today = translate_word('today');
                if (trans_today != ''){
                    p.text(trans_today);
                }
                else{
                    p.text('today');
                }
            }
            else if (i == 1){
                var trans_tomorrow = translate_word('tomorrow');
                if (trans_tomorrow != ''){
                    p.text(trans_tomorrow);
                }
                else{
                    p.text('tomorrow');
                }
            }
            else{
                p.text('D+' + (i));
            }
            div.append(p);
            var img = $('<img>');
            var url = base_url + '/src/weather/' + weather_type + '.svg';
            img.attr('src',url);
            div.append(img);
            var p = $('<p class="weather_name">');
            if (translated_name != '') {
                p.text(translated_name);
            }
            else{
                p.text(weather_name);
            }
            div.append(p);
            var p = $('<p class="weather_temp">');
            p.html('<span class="tmin">' + weather_temp_min + '°C</span> - <span class="tmax">' + weather_temp_max + '°C</span>');
            div.append(p);
            $('.weather .content').append(div);
        }
    });
}

function translate_word(word){
    var translated_name = '';
    
    for (var i = 0; i < words_list.length; i++){
        var attr = get_lang_attr(lang_i);
        if (words_list[i].en_words.split(',').includes(word)){
            translated_name = words_list[i][attr];
            break;
        }
    }
    return translated_name;
}

function populate_time(){
    if ($('.time').length == 0){
        return;
    }
    var tr = $('<tr>');
    var display_name = 'Week';
    var translated_name = translate_word('week');
    if (translated_name.includes(' ')){
        translated_name = translated_name.split(' ')[1];
    }
    if (translated_name != ''){
        display_name += ' : ' + translated_name;
    }
    tr.append('<th colspan="7">' + display_name + '</th>');
    $('.table_week').append(tr);
    var tr = $('<tr>');
    for (var i = 0; i < days.length; i++){
        var display_name = '<p>' + days[i] + '</p>';
        var en_name = days[i].toLowerCase();
        var translated_name = translate_word(en_name);
        if (translated_name.includes(' ')){
            translated_name = translated_name.split(' ')[1];
        }
        if (translated_name != ''){
            display_name += '<p>' + translated_name + '</p>';
        }
        tr.append('<td>' + display_name + '</td>');
    }
    $('.table_week').append(tr);

    var tr = $('<tr>');
    var en_name = "year";
    var display_name = 'Year';
    var translated_name = translate_word(en_name);
    if (translated_name.includes(' ')){
        translated_name = translated_name.split(' ')[1];
    }
    if (translated_name != ''){
        display_name += ' : ' + translated_name;
    }
    tr.append('<th colspan="12">' + display_name + '</th>');
    $('.table_year').append(tr);
    var tr = $('<tr>');
    for (var i = 0; i < months.length; i++){
        var display_name = '<p>' + months[i] + '</p>';
        var en_name = months[i].toLowerCase();
        var translated_name = translate_word(en_name);
        if (translated_name.includes(' ')){
            translated_name = translated_name.split(' ')[1];
        }
        if (translated_name != ''){
            display_name += '<p>' + translated_name + '</p>';
        }
        tr.append('<td>' + display_name + '</td>');
    }
    $('.table_year').append(tr);

    var tr = $('<tr>');
    var en_name = "season";
    var translated_name = '';
    var display_name = 'Seasons';
    var translated_name = translate_word(en_name);
    if (translated_name.includes(' ')){
        translated_name = translated_name.split(' ')[1];
    }
    if (translated_name != ''){
        display_name += ' : ' + translated_name;
    }
    tr.append('<th colspan="12">' + display_name + '</th>');
    $('.table_season').append(tr);
    var tr = $('<tr>');
    for (var i = 0; i < seasons.length; i++){
        var display_name = '<p>' + seasons[i] + '</p>';
        var en_name = seasons[i].toLowerCase();
        var translated_name = '';
        var translated_name = translate_word(en_name);
        if (translated_name.includes(' ')){
            translated_name = translated_name.split(' ')[1];
        }
        if (translated_name != ''){
            display_name += '<p>' + translated_name + '</p>';
        }
        tr.append('<td>' + display_name + '</td>');
    }
    $('.table_season').append(tr);
}

function populate_color_picker(){
    if ($('.colors').length == 0){
        return;
    }

    for (var i = 0; i < palette.length; i++){
        
        var en_name = palette[i][0];
        var translated_name = translate_word(en_name);
        
        if (translated_name != ''){
            palette[i] = [en_name + ' : ' + translated_name,palette[i][1],palette[i][2],palette[i][3]];
        }
    }

    var jspalette = ['rgb(0,0,0)','rgb(255,255,255)','rgb(128,128,128)'];
    for (var i = 0; i < palette.length-4; i++){
        var rgb = HSVtoRGB(palette[i][1]/360,palette[i][2]/100,palette[i][3]/100);
        jspalette.push('rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')');
    }
    jscolor.presets.default = {
        position: 'right',
        palette: jspalette,
        onInput: change_color,
        position:'top',
        smartPosition:false,
        width:275,
        height:200,
        shadowColor:'rgba(0,0,0,0.1)',
        backgroundColor:'#ded5ac',
        borderColor:'rgba(0,0,0,0)',
        borderRadius:'10',
        paletteHeight:'30'
    };
    $('.colors .content').append('<div id="color_picker" data-jscolor="" value="#3399FF"><p>pick a color</p></div><br/>');
    jscolor.install();
}

function get_closest_color(h,s,v){
    //console.log(h,s,v);
    if (v < 25){
        return palette[palette.length - 1][0];
    }
    if (s < 15){
        if (v > 75){
            return palette[palette.length - 3][0];
        }
        return palette[palette.length - 2][0];
    }
    var closest_idx = 0;
    var closest_dist = 1000;
    for (var i = 0; i < palette.length - 3; i++){
        var dist = Math.sqrt(Math.pow(h - palette[i][1],2) + Math.pow(s - palette[i][2],2) + Math.pow(v - palette[i][3],2));
        if (dist < closest_dist){
            closest_idx = i;
            closest_dist = dist;
        }
    }
    return palette[closest_idx][0];
}

function change_color(){
    var h = document.querySelector('#color_picker').jscolor.channel('H');
    var s = document.querySelector('#color_picker').jscolor.channel('S');
    var v = document.querySelector('#color_picker').jscolor.channel('V');
    var col = get_closest_color(h,s,v);
    if (document.querySelector('#color_picker').jscolor.isLight()){
        $('#color_picker p').css('color','rgb(90, 72, 19)');
    }
    else{
        $('#color_picker p').css('color','#f9f8e2');
    }
    $('#color_picker p').text(col);
}

function populate_numbers(){
    for (const [index, [key, value]] of Object.entries(Object.entries(special_numbers[lang_i]))) {
        var number = $("<div>");
        number.addClass("number");
        var number_p = $("<p>").text(key);
        number.append(number_p);
        var number_p = $("<p>").text(value);
        number.append(number_p);
        number.click({letter:value},play_word_sound);
        number.insertBefore('#number_translate');
    }
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

function get_words(){
    var url = "/php/get_words.php";
    $.get(url).then(function(data) {
        var lines = data.split("<br/>").reverse();
        lines.shift();

        var wordsDiv = $("#words");

        var total_words = 0;

        lines.forEach(function(line) {
            if (line.length == 0) {
                return;
            }
            line = line.replace("&#039;", "'");//replace escaped apostrophes
            var is_hidden = false;
            var parts = line.split(":");
            var type    = parts[0].trim();
            var tags = [];
            var genders = [];
            if (type.includes(';')){
                tags = type.split(';')[1];
                type = type.split(';')[0];
                if (tags.includes(',')){
                    var tags_in_word = tags.split(',');
                }
                else{    
                    var tags_in_word = [tags];
                }
                for (var i = 0; i < tags_in_word.length; i++){
                    if (tag_list.includes(tags_in_word[i]) == false && tags_in_word[i] != 'hidden'){
                        tag_list.push(tags_in_word[i]);
                    }
                }
            }
            if (type.includes('-')){
                genders = type.split('-')[1];
                type = type.split('-')[0];
                
                if (genders.includes(',')){
                    genders = genders.split(',');
                }
                else{
                    genders = [genders];
                }
            }
            if (tags.includes('hidden')){
                is_hidden = true;
            }
            var ka_words = parts[1].trim();
            var en_words = parts[2].trim();
            var fr_words = parts[3].trim();
            var ru_words = parts[4].trim();
            var kr_words = parts[5].trim();
            var jp_words = parts[6].trim();
            var occs = parts[7].trim();
            var occs_ok = parts[8].trim();
            if (occs == ''){
                occs = -1;
            }
            else{
                occs = parseInt(occs);
            }
            if (occs_ok == ''){
                occs_ok = -1;
            }
            else{
                occs_ok = parseInt(occs_ok);
            }
            var lang_i_with_en = lang_i;
            if (lang_i > 0){
                lang_i_with_en += 1;
            }
            if (parts[lang_i_with_en + 1].trim() == "-") {
                return;
            }
            total_words++;
            //Add "to" in front of verbs
            var en_words_display = en_words;
            if (type == 'v'){
                var len = en_words.split(",").length;
                for (var i = 0; i < len; i++){
                    var en_word = en_words.split(",")[i];
                    en_words_display = "to " + en_word;
                }
            }
            if (fr_words.includes('(')){
                var new_fr_words = fr_words.split('(')[0];
                var fr_pron = fr_words.split('(')[1].slice(0,-1).split('_');
            }
            else{
                var new_fr_words = fr_words;
                var fr_pron = [];
            }
            words_list.push({
                type:type,
                hidden:is_hidden,
                tags:tags,
                genders:genders,
                ka_words: ka_words,
                en_words: en_words,
                fr_words: new_fr_words,
                ru_words: ru_words,
                kr_words: kr_words,
                jp_words: jp_words,
                occs: occs,
                occs_ok: occs_ok,
            });
            ka_words = ka_words.replace(/,/g,", ");
            en_words = en_words.replace(/,/g,", ");
            new_fr_words = new_fr_words.replace(/,/g,", ");
            ru_words = ru_words.replace(/,/g,", ");
            kr_words = kr_words.replace(/,/g,", ");
            jp_words = jp_words.replace(/,/g,", ");

            if (genders.length > 0 && lang_i == 2){
                if (new_fr_words.includes(', ')){
                    var fr_words = new_fr_words.split(', ');
                }
                else{
                    var fr_words = [new_fr_words];
                }
                for (var i = 0; i < fr_words.length; i++){
                    if (genders[i].length == 0){
                        continue;
                    }
                    var prep = ['le','la','les'][['m','f','p'].indexOf(genders[i])];
                    if (['a','e','i','o','u','y','é','è','â','ê'].includes(fr_words[i][0])){
                        prep = ['un','une','les'][['m','f','p'].indexOf(genders[i])];
                    }
                    fr_words[i] = prep + ' ' + fr_words[i];
                }
                new_fr_words = fr_words.join(', ');
            }
            
            if (is_hidden == false){
                display_words = [ka_words,ru_words,new_fr_words,kr_words,jp_words];

                var wordElement = $("<p>").text(display_words[lang_i] + ' : ' + en_words_display);
                wordElement.attr('type'    , type   );
                wordElement.attr('tags'    , tags);
                wordElement.attr('genders' , genders);
                wordElement.attr('ka_words', ka_words);
                wordElement.attr('en_words', en_words);
                wordElement.attr('fr_words', new_fr_words);
                wordElement.attr('ru_words', ru_words);
                wordElement.attr('kr_words', kr_words);
                wordElement.attr('jp_words', jp_words);
                wordElement.attr('occs'    , occs    );
                wordElement.attr('occs_ok' , occs_ok );
                if (fr_words != '-' && fr_pron.length > 0){
                    wordElement.attr('fr_pron' , JSON.stringify(fr_pron));
                }
                else{
                    wordElement.attr('fr_pron' , '-');
                }
                wordElement.addClass("word");
                wordElement.on("click", play_word_sound);

                wordsDiv.append(wordElement);
            }
        });
        $('#search_bar').attr('placeholder', 'search in ' + total_words + ' words');
        $('#search_bar').val('');
        //shuffled_list = shuffleArray(words_list);
        //shuffled_list2 = shuffleArray(words_list);
        shuffled_list = get_most_mistakes_word_list();
        shuffled_list2 = get_most_mistakes_word_list();
        var new_shuffled_list = [];
        for (var i = 0; i < shuffled_list.length; i++){
            if (shuffled_list[i].hidden == true){
                continue;
            }
            if (shuffled_list[i][lang_params[lang_i] + '_words'] != ''){
                new_shuffled_list.push(shuffled_list[i]);
            }
        }
        shuffled_list = new_shuffled_list;
        
        for (var i = 0; i < shuffled_list.length; i++){
            if (shuffled_list[i].ka_words == 'күн'){
                shuffled_list.unshift(shuffled_list[i]);
                break;
            }
        }

        setup_keyboard();
        update_tag_filter();
        update_game_guess();
        update_association_game();
        create_body_diagram();
        create_clothes_diagram();
        populate_color_picker();
        populate_time();
        populate_wordle();
        populate_wordle_alphabet();
        populate_clock();
        populate_weather();
        setup_tenses();
        if ($('#alphabet').length > 0){
            populate_alphabet();
        }
        if (section == 'toys'){
            $('#nav_games').click();
        }
        else if (section == 'grammar'){
            $('#nav_grammar').click();
        }
    });

    var alphabet = pron_alphabets[lang_i];
    for (var i = 0; i < alphabet.length; i++) {
        var url = base_url + '/src/sounds/' + languages[lang_i] + '/word_sounds/' + alphabet[i] + '.mp3';
        var audio = new Audio(url);
        get_audio_duration(audio,i);
        audio.src = url;
    }
}

function setup_keyboard(){
    if (lang_i > 2){
        $('#keyboard_button').hide();
        return;
    }

    var alphabet = alphabets[lang_i];
    for (var i = 0; i < alphabet.length; i++) {
        var ltr = alphabet[i];
        var letter = $("<div>").html('<p>' + ltr + '</p>');
        letter.addClass("letter");
        letter.on("click", add_letter_to_input);
        $("#keyboard").append(letter);
    }
}

function add_letter_to_input(event){
    var letter = $(this).text();
    var input = $('#search_bar');
    var input_value = input.val();
    var input_value = input_value + letter;
    input.val(input_value);
    input.focus();
    input.trigger('input');
}

$(document).on('keydown', function(e) {
    if (e.key === "Escape" && $('#keyboard').is(':visible')) {
        $('#keyboard').fadeOut(200);
        $('#keyboard_button').attr('active', false);
    }
});

$('#keyboard_button').click(function(){
    $('#keyboard').fadeToggle(200);
    if ($('#keyboard_button').attr('active') == 'true'){
        $('#keyboard_button').attr('active',false);
    }
    else{
        $('#keyboard_button').attr('active',true);
    }
});

$('.keyboard_close').click(function(){
    $('#keyboard').fadeOut(200);
    $('#keyboard_button').attr('active',false);
    $('#search_bar').focus();
});

function populate_clock(){
    if ($('.clock').length == 0){
        return;
    }
    $('.clock').clockTimePicker({
        colors: {
            popupBackgroundColor: 'rgba(0,0,0,0)',
            clockFaceColor: '#efe273',
            selectorColor: '#f39f95'
        },
        fonts: {
            fontFamily: "Balsamiq Sans",
            clockInnerCircleFontSize:20,
            clockOuterCircleFontSize:20,
        },
        onChange: clock_translate,
        onAdjust: clock_translate,
        popupWidthOnDesktop:300,

    });
    var clock_div = $('.clock-timepicker-popup div');
    var clock_shadow = $('<div>');
    clock_shadow.addClass('clock-shadow');
    clock_shadow.css('width',clock_div.width());
    clock_shadow.css('height',clock_div.height());
    clock_shadow.css('border-radius',clock_div.width());
    clock_div.append(clock_shadow);
    $('<div id="clock_output">pick a time</div>').insertAfter($('.clock-timepicker'));
}

function clock_translate(){
    var clock_input = $('input.clock').get(0);
    var time = clock_input.value;
    var hours = parseInt(time.split(':')[0]);
    var minutes = parseInt(time.split(':')[1]);
    //console.log(hours,minutes);
    var str = clock_intro[lang_i] + ' ';
    if (lang_i == 0){
        if (minutes > 30 && minutes % 5 == 0){
            hours += 1
        }
        if (hours > 12){
            hours -= 12;
            str += 'кешкі ' + get_spelled_out_number(hours) + ' ';
        }
        else if (hours < 12){
            str += 'таңғы ' + get_spelled_out_number(hours) + ' ';
        }
        else{
            str += get_spelled_out_number(hours) + ' ';
        }
        if (minutes == 0){
            
        }
        else if (minutes == 30){
            str += 'жарым';
        }
        else if (minutes % 5 == 0){
            str = str.slice(0,-1);
            if (minutes < 30){
                if (minutes < 10){
                    str += hour_suffixes_1[hours] + ' ' + get_spelled_out_number(0) + ' ' + get_spelled_out_number(minutes) + ' кетті';
                }
                else{
                    str += hour_suffixes_1[hours] + ' ' + get_spelled_out_number(minutes) + ' кетті';
                }
            }
            else{
                str += hour_suffixes_2[hours] + ' ' + get_spelled_out_number(60 - minutes) + ' минут қалды';
            }
        }
        else{
            if (minutes < 10){
                str += get_spelled_out_number(0) + ' ' + get_spelled_out_number(minutes);
            }
            else{
                str += get_spelled_out_number(minutes);
            }
        }
        $('#clock_output').text(str);
    }
    else if (lang_i == 2){
        if (minutes > 30 && minutes % 5 == 0 && (hours < 12 || hours == 23)){
            hours += 1
        }
        if (hours == 0 || hours == 24){
            str += 'minuit ';
        }
        else if (hours == 12){
            str += 'midi ';
        }
        else{
            var hour_str = get_spelled_out_number(hours);
            if (hour_str.slice(-2) == 'un'){
                hour_str += 'e';
            }
            if (hour == 1){
                str += hour_str + ' heure';
            }
            else{
                str += hour_str + ' heures ';
            }
        }
        if (minutes == 0){
            
        }
        else if (minutes == 30){
            if (hours <= 12){
                str += 'et demi';
            }
            else{
                str += ' trente';
            }
        }
        else if (minutes == 15){
            if (hours <= 12){
                str += 'et quart';
            }
            else{
                str += 'quinze';
            }
        }
        else if (minutes == 45){
            str += 'moins le quart';
        }
        else if (minutes > 30 && minutes % 5 == 0){
            str += ' moins ' + get_spelled_out_number(60 - minutes);
        }
        else{
            str += get_spelled_out_number(minutes);
        }
        $('#clock_output').text(str);
    }
}

function populate_wordle(){    
    var word = "";
    var word_en = "";
    for (var i = wordle_last_word_idx; i < words_list.length; i++){
        var rand_word = shuffled_list[i][lang_params[lang_i] + '_words'];
        if ((rand_word.length == 0) || (rand_word == '-') || (rand_word.length < 4) || (rand_word.length > 6) || (rand_word.includes(',')) || (rand_word.includes(' ')) ||(rand_word.includes('?'))){
            continue;
        }
        word = rand_word;
        word_en = shuffled_list[i].en_words;
        wordle_last_word_idx = i + 1;
        break;
    }
    var wordle = $('#wordle');
    wordle.html('');
    wordle_word = word.toLowerCase();
    worlde_word_en = word_en.toLowerCase();
    wordle_active_row = 0;
    var table = $('<table>');
    for (var i = 0; i < 5; i++){
        var tr = $('<tr>');
        for (var j = 0; j < word.length; j++){
            var td = $('<td>');
            tr.append(td);
        }
        table.append(tr);
    }
    wordle.append(table);
    $('#wordle_output').text('');
}

function populate_wordle_alphabet(){
    var alphabet_el = $('#wordle_alphabet');
    alphabet_el.html('');
    var alphabet = alphabets[lang_i];
    for (var i = 0; i < alphabet.length; i++) {
        var letter = $("<p>").text(alphabet[i]);
        letter.addClass("wordle_letter");
        letter.attr('type',-1);
        letter.on("click", add_wordle_letter);
        alphabet_el.append(letter);
    }
    alphabet_el.append('<br/><div class="letter wordle_enter">ENTER</div>');
    alphabet_el.append('<div class="letter wordle_return"></div>');
}

$(document).on('click','.wordle_enter',function(e){
    wordle_enter_word();
});

$(document).on('click','.wordle_return',function(e){
    wordle_remove_letter();
});

function wordle_enter_word(){
    var row = $('#wordle').children('table').children('tr').eq(wordle_active_row);
    var word = '';
    for (var i = 0; i < wordle_word.length; i++){
        word += row.children('td').eq(i).text();
    }
    if (word.length < wordle_word.length){
        $('#wordle_output').css('cursor','auto');
        $('#wordle_output').text('Not enough letters !');
        $('#wordle_output').animate({ opacity: 1 });
        setTimeout(function() {
            $('#wordle_output').animate({ opacity: 0 });
        }, 2500);
        return;
    }

    var word_copy = wordle_word;

    for (var i = 0; i < word.length; i++){
        if (word[i] == ""){
            continue;
        }
        var type = 0;
        if (word[i] == wordle_word[i]){
            type = 2;
            for (var j = 0; j < word_copy.length; j++){
                if (word_copy[j] == word[i]){
                    word_copy = word_copy.slice(0,j) + word_copy.slice(j+1);
                    break;
                }
            }
        }
        wordle_update_td(wordle_active_row,i,type,i*250);
    }

    for (var i = 0; i < word.length; i++){
        if (word[i] == "" || word[i] == wordle_word[i]){
            continue;
        }
        var type = 0;
        for (var j = 0; j < word_copy.length; j++){
            if (word_copy[j] == word[i]){
                type = 1;
                word_copy = word_copy.slice(0,j) + word_copy.slice(j+1);
                break;
            }
        }
        wordle_update_td(wordle_active_row,i,type,i*250);
    }

    wordle_active_row++;
    setTimeout(function() {
        if (word == wordle_word){
            create_confettis();
            $('#wordle_output').html('well done, ' + wordle_word + ' - ' + worlde_word_en + '<br/>click to replay');
            add_xp_word(worlde_word_en,true);
        }
        else if (wordle_active_row == 5){
            $('#wordle_output').html('the word was ' + wordle_word + ' - ' + worlde_word_en + '<br/>click to replay');
            add_xp_word(worlde_word_en,false);
        }
        else{
            return;
        }
        $('#wordle_output').css('cursor','pointer');
        $('#wordle_output').animate({ opacity: 1 });
        $('#wordle_output').off('click');
        $('#wordle_output').on('click',function(e){
            $('#wordle_output').animate({ opacity: 0 });
            populate_wordle_alphabet();
            populate_wordle();
        });
    },word.length*250);
}

function create_confettis(){
    const end = Date.now() + 5 * 1000;

    const colors = ["#fbc59f","#f4eb84","#f4eb84","#f39f95","#a9e3bb","#e6b8b8","#a6cdf4"];

    (function frame() {
    confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
    });

    confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
    });

    if (Date.now() < end) {
        requestAnimationFrame(frame);
    }
    })();
}

function wordle_update_td(row_i,col_i,type,t){
    var types = ['#f39f95','#c499e0','#a9e3bb'];
    setTimeout(function() {
        var row = $('#wordle').children('table').children('tr').eq(row_i);
        row.children('td').eq(col_i).css('background-color',types[type]);
        for (var i = 0; i < $('#wordle_alphabet').children('.wordle_letter').length; i++){
            var letter = $('#wordle_alphabet').children('.wordle_letter').eq(i);
            if (letter.text() == row.children('td').eq(col_i).text() && type > letter.attr('type')){
                letter.css('background-color',types[type]);
                letter.attr('type',type);
                break;
            }
        }
    },t);
}

function wordle_remove_letter(){
    var row = $('#wordle').children('table').children('tr').eq(wordle_active_row);
    for (var i = wordle_word.length-1; i >= 0; i--){
        var td = row.children('td').eq(i);
        if (td.text().length > 0){
            td.text('');
            td.removeClass('filled');
            break;
        }
    }
}

function add_wordle_letter(){
    var letter = $(this).text();
    var wordle = $('#wordle');
    var table = wordle.children('table');
    var tr = table.children('tr').eq(wordle_active_row);
    for (var i = 0; i < wordle_word.length; i++){
        var td = tr.children('td').eq(i);
        if (td.text().length == 0){
            td.text(letter);
            td.addClass('filled');
            break;
        }
    }
}

function update_tag_filter(){
    var tag_div = $('#tags_list');
    for (var i = 0; i < tag_list.length; i++){
        var tag = $("<div>").text(tag_list[i]);
        tag.addClass('tag');
        tag_div.append(tag);
    }
    position_tag_list();
}

function create_body_diagram(){
    if ($('.body_parts').length == 0){
        return;
    }
    var url = "/src/body/body_parts.svg";
    
    $('#body_diagrams').load(url);
}

function create_clothes_diagram(){
    if ($('.clothes').length == 0){
        return;
    }
    var url = "/src/clothes/outfit" + rand_outfit_i + ".svg";
    
    $('#clothes_diagrams').load(url);

    $('#clothes_arrow_right').on('click',function(e){
        rand_outfit_i = rand_outfit_i + 1;
        if (rand_outfit_i > nb_outfits){
            rand_outfit_i = 1;
        }
        $('#clothes_diagrams').animate({left: '-100%'}, 500, function() {
            var url = base_url + "/src/clothes/outfit" + rand_outfit_i + ".svg";
            $('#clothes_diagrams').load(url, function() {
                $('#clothes_diagrams').css('left', '100%');
                $('#clothes_diagrams').animate({left: '0%'}, 500);
            });
        });
    });

    $('#clothes_arrow_left').on('click',function(e){
        rand_outfit_i = rand_outfit_i - 1;
        if (rand_outfit_i == 0){
            rand_outfit_i = nb_outfits;
        }
        $('#clothes_diagrams').animate({left: '100%'}, 500, function() {
            var url = base_url + "/src/clothes/outfit" + rand_outfit_i + ".svg";
            $('#clothes_diagrams').load(url, function() {
                $('#clothes_diagrams').css('left', '-100%');
                $('#clothes_diagrams').animate({left: '0%'}, 500);
            });
        });
    });

}

function populate_alphabet(){
    var frequencies_dict = {};
    
    for (var i = 0; i < alphabets[lang_i].length; i++) {
        frequencies_dict[alphabets[lang_i][i]] = 0;
    }

    for (var i = 0; i < words_list.length; i++){
        var attr = get_lang_attr(lang_i);
        var words = words_list[i][attr];
        for (var j = 0; j < words.length; j++){
            var letter = words.split('')[j];
            if (frequencies_dict[letter] != undefined){
                frequencies_dict[letter]++;
            }
        }
    }

    var total_freq = 0;
    for (var i = 0; i < alphabets[lang_i].length; i++) {
        total_freq += frequencies_dict[alphabets[lang_i][i]];
    }

    var alphabet = alphabets[lang_i];
    for (var i = 0; i < alphabet.length; i++) {
        var ltr = alphabet[i];
        var freq = frequencies_dict[ltr];
        var letter = $("<div>").html('<p>' + ltr + '</p><p>' + (freq/total_freq*100).toFixed(2) + '%</p>');
        letter.attr('sound',ltr)
        letter.addClass("letter");
        letter.on("click", play_letter_sound);
        $("#alphabet").append(letter);
    }
}

$(document).on('input','#number_input',function(e){
    var number = $(this).val();
    var translated_number = get_spelled_out_number(number);
    if (translated_number == ''){
        translated_number = 'not a number !';
    }
    $('#number_output p').text(translated_number);
    $('#number_output').attr('class','col' + Math.floor(Math.random() * 7 + 1));
});

function get_spelled_out_number(number){
    if (number > 999999){
        if (lang_i == 0){
            return 'Тым үлкен!';
        }
        else if (lang_i == 1){
            return 'Слишком большая!';
        }
        else if (lang_i == 2){
            return 'Trop grand !';
        }
        else if (lang_i == 3){
            return '';//TODO : ask paloma about this
        }
        else if (lang_i == 4){
            return '';//TODO : ask ziyu about this
        }
    }
    if (number == 0){
        return special_numbers[lang_i][0];
    }
    var translated_number = '';
    var thousands = Math.floor(number / 1000);
    var hundreds = Math.floor((number % 1000) / 100);
    var tens = Math.floor((number % 100) / 10);
    var units = number % 10;
    var lang_numbers = special_numbers[lang_i];
    var translated_number = '';
    if (thousands > 0){
        if (thousands > 1){
            if (thousands > 10){
                translated_number += get_spelled_out_number(thousands) + ' ' + lang_numbers[1000] + ' ';
            }
            else{
                translated_number += lang_numbers[thousands] + ' ' + lang_numbers[1000] + ' ';
            }
        }
        else{
            translated_number += lang_numbers[1000] + ' ';
        }
    }
    if (hundreds > 0){
        if ((hundreds == 1 && thousands > 0) || hundreds > 1){
            translated_number += lang_numbers[hundreds] + ' ' + lang_numbers[100] + ' ';
        }
        else{
            translated_number += lang_numbers[100] + ' ';
        }
    }
    if (tens*10 + units in lang_numbers && tens*10 + units != 0){
        translated_number += lang_numbers[tens*10 + units];
    }
    else{
        if (tens > 0){
            translated_number += lang_numbers[tens*10] + ' ';
        }
        if (units > 0){
            translated_number += lang_numbers[units];
        }
    }
    return translated_number;
}

$(document).on('click','#grammar h2',function(e){
    $(this).attr('active',$(this).attr('active') == 'true' ? 'false' : 'true');
    if ($(this).attr('active') == 'true'){
        $(this).siblings('.section_content').css('max-height','5000px');
    }
    else{
        $(this).siblings('.section_content').css('max-height','0px');
    }
});

$(document).on('click','#filter_tags',function(e){
    if ($('#tags_list').is(':visible')){
        $(this).attr('active','false');
        $('#tags_list').fadeOut();
    }
    else{
        $(this).attr('active','true');
        $('#tags_list').fadeIn();
    }
});

$(document).on('click','.tag',function(e){
    var filter = 'tags';
    if ($(this).html() != 'all'){
        filter = $(this).html();
    }
    else{
        $('#filter_tags').attr('active','false');
    }
    $('.tag-filter p').html(filter);
    $('#tags_list').fadeOut();
    update_word_list();
});

$(document).on('mousemove','.body_parts',function(e){
    body_info();
});

$(document).on('mousemove','.clothes',function(e){
    clothes_info();
});

$(document).on('click','.body_parts',function(e){
    body_info();
});

$(document).on('click','.filter',function(e){
    $(this).attr('active',$(this).attr('active') == 'true' ? 'false' : 'true');
    update_word_list();
});

$(window).resize(function() {
    position_tag_list();
});

function position_tag_list(){
    var filter_tags = $('#filter_tags');
    var tags_list = $('#tags_list');
    tags_list.css('top',filter_tags.offset().top + filter_tags.height() + 15);
    tags_list.css('left', filter_tags.offset().left + filter_tags.outerWidth() / 2 - tags_list.outerWidth() / 2);
}

function body_info(){
    var bodyInfo = $('#body_info');
    var nbhovered = $('polygon:hover').length;
    if (nbhovered == 0) {
        bodyInfo.css('height','0px');
        bodyInfo.css('width','0px');
        bodyInfo.css('opacity','0');
        $('polygon').css('cursor', 'pointer');
    }
    else {
        $('polygon').css('cursor', 'pointer');
        bodyInfo.css('opacity','1');
        bodyInfo.css('height','50px');
        bodyInfo.css('width','100px');
        var en_name = $('polygon:hover').attr('name');
        var translated_name = '';
        $('.word').each(function(){
            var attr = get_lang_attr(lang_i);
            var en_words = $(this).attr('en_words').split(', ');
            
            if (en_words.includes(en_name)){
                translated_name = $(this).attr(attr);
            }
        });
        if (translated_name == ''){
            $('#body_info p').html($('polygon:hover').attr('name'));
        }
        else{
            $('#body_info p').html($('polygon:hover').attr('name') + ' : ' + translated_name);
        }
    }
    var mouseX = event.pageX - 50;
    var mouseY = event.pageY + 30;
    bodyInfo.css({top: mouseY, left: mouseX});
}

function get_lang_attr(lang_i){
    var attr = lang_params[lang_i] + '_words';
    return attr;
}
    

function clothes_info(){
    var bodyInfo = $('#clothes_info');
    var nbhovered = $('g#SELECT g:hover').length;
    if (nbhovered == 0) {
        bodyInfo.css('height','0px');
        bodyInfo.css('width','0px');
        bodyInfo.css('opacity','0');
        $('polygon').css('cursor', 'pointer');
    }
    else {
        $('polygon').css('cursor', 'pointer');
        bodyInfo.css('opacity','1');
        bodyInfo.css('height','50px');
        bodyInfo.css('width','100px');
        var en_name = $('g#SELECT g:hover').attr('name');
        var translated_name = translate_word(en_name);
        if (translated_name == ''){
            $('#clothes_info p').html(en_name);
        }
        else{
            $('#clothes_info p').html(en_name + ' : ' + translated_name);
        }
    }
    var mouseX = event.pageX - 50;
    var mouseY = event.pageY + 30;
    bodyInfo.css({top: mouseY, left: mouseX});
}

function update_word_list(){
    var searchValue = $('#search_bar').val().toLowerCase();
    var filters = [false,false,false,false];
    $('.filter').each(function(i,e){
        filters[i] = $(e).attr('active') == 'true';
    });
    $(".word").each(function() {
        var type = $(this).attr("type");
        var ka_words = $(this).attr("ka_words").toLowerCase();
        var en_words = $(this).attr("en_words").toLowerCase();
        var fr_words = $(this).attr("fr_words").toLowerCase();
        var ru_words = $(this).attr("ru_words").toLowerCase();
        var kr_words = $(this).attr("kr_words").toLowerCase();
        var jp_words = $(this).attr("jp_words").toLowerCase();
        lang_words = [ka_words,ru_words,fr_words,kr_words,jp_words];
        if (type == 'v'){
            var len = en_words.split(",").length;
            for (var i = 0; i < len; i++){
                var en_word = en_words.split(",")[i];
                en_words = en_words + "," + "to " + en_word;
            }
        }
        if (lang_words[lang_i].includes(searchValue) || en_words.includes(searchValue)) {
            var type_i = ['n','v','a','o'].indexOf(type);
            if ((filters[type_i]) || (filters.includes(true) == false)){
                if ($('.tag-filter p').html() != 'tags'){
                    if ($(this).attr('tags').split(',').includes($('.tag-filter p').html())){
                        $(this).show();
                    }
                    else{
                        $(this).hide();
                    }
                }
                else{
                    $(this).show();
                }
            }
            else{
                $(this).hide();
            }
        } else {
            $(this).hide();
        }
    });
}

$("#search_bar").on("input", function() {
    update_word_list();
});

$('#guess_input').on('keypress', function(e) {
    if(e.which != 13) {//Only listen to enter key
        return;
    }

    var guess = $(this).val().toLowerCase();
    if (lang_to_en){
        var attr = 'en_words';
    }
    else{
        var attr = lang_params[lang_i] + '_words';
    }
    var sol_words = $('#guess_word').attr(attr).toLowerCase().split(",");
    var sol_words_possible = sol_words.slice();
    if ($('#guess_word').attr(attr).toLowerCase().includes(',')){
        sol_words_possible.push($('#guess_word').attr(attr).toLowerCase());
    }
    if (lang_to_en){
        if ($('#guess_word').attr('type') == 'v'){
            var len = sol_words.length;
            for (var i = 0; i < len; i++){
                var sol_word = sol_words[i];
                sol_words_possible.push('to ' + sol_word);
                sol_words[i] = 'to ' + sol_word;
            }
        }
    }
    
    guess = guess.replace("?", "");
    sol_words_possible = sol_words_possible.map(word => word.replace("?", ""));

    if (guess_index == shuffled_list.length){
        if (game_done == false){
            game_done = true;
            $("#guess_result").text("Game finished! Click to restart.");
            $('#guess_result').css('cursor','pointer');
            $('#guess_result').animate({ opacity: 1 },{queue:false});
            $("#guess_result").on("click", function() {
                guess_index = 0;
                correct_guesses = 0;
                total_guesses = 0;
                game_done = false;
                shuffled_list = shuffleArray(words_list);
                update_progress_bar('#guess_game',correct_guesses,total_guesses,true);
                update_game_guess();
                $('#guess_result').css('cursor','default');
                $('#guess_result').animate({ opacity: 0},{queue:false});
                $('#guess_result').off("click");
                $('#guess_input').focus();
            });
        }
    }
    else{
        $('#guess_result').animate({'opacity':1},{queue:false},{duration:5});
        clearTimeout(game_timeout);
        var time = 500;
        if ((sol_words_possible.includes(guess))){
            $("#guess_result").text("Correct!");
            add_xp_word($('#guess_word').attr('en_words'),true);
            correct_guesses++;
        } else {
            if (guess.length == 0) {
                var txt = "It was " + sol_words;
            }
            else{
                var txt = "Nope, it was " + sol_words;
            }
            $("#guess_result").text(txt);
            add_xp_word($('#guess_word').attr('en_words'),false);
            time = 2500;
        }

        guess_index++;
        total_guesses++;
        update_progress_bar('#guess_game',correct_guesses,total_guesses,true);
        update_game_guess();
        game_timeout = setTimeout(function() {
            $('#guess_result').delay(time).animate({ opacity: 0 },{queue:false});
        }, time);
    }
});

function update_association_game(){
    if (shuffled_list2.length-1 < total_associations + 4){
        //DONE
        return
    }
    var rand_order = shuffleArray([0,1,2,3]);
    for (var i = 0; i < 4; i++){
        var word = shuffled_list2[total_associations + i];
        var en_word = word['en_words'];
        var lang_word = word[lang_params[lang_i] + '_words'];
        var en_word_display = "";
        if (word.type == 'v'){
            var len = en_word.split(",").length;
            for (var j = 0; j < len; j++){
                var en = en_word.split(",")[j];
                en_word_display = "to " + en;
            }
        }
        else{
            en_word_display = en_word;
        }
        $('#association_left_column').children().eq(rand_order[i]).html(lang_word);
        $('#association_left_column').children().eq(rand_order[i]).attr('en_word',en_word_display);
        $('#association_left_column').children().eq(rand_order[i]).attr('failed',false);
        $('#association_right_column').children().eq(i).html(en_word_display);
    }
}

$('.association_word').on('click',function(e){
    var is_active = $(this).attr('active') == 'true';
    var is_done = $(this).attr('done') == 'true';
    if (is_done){
        return;
    }
    var is_left = $(this).parent().attr('id') == 'association_left_column';
    if (is_active){
        $(this).attr('active','false');
    }
    else{
        if (is_left){
            $('#association_left_column').children().attr('active','false');
        }
        else{
            $('#association_right_column').children().attr('active','false');
        }
        $(this).attr('active','true');
        verify_association();
    }

});

function verify_association(){
    var left_active = $('#association_left_column').children('[active="true"]');
    var right_active = $('#association_right_column').children('[active="true"]');
    if (left_active.length == 0 || right_active.length == 0){
        return
    }
    var left_word_en = left_active.attr('en_word');
    var right_word_en = right_active.text();
    if (left_word_en == right_word_en){
        $('#association_result').text('Correct!');
        left_active.attr('done','true');
        right_active.attr('done','true');
        if (left_active.attr('failed') == 'true'){
            add_xp_word(left_word_en,false);
        }
        else{
            add_xp_word(left_word_en,true);
        }
    }
    else{
        left_active.attr('failed','true');
        $('#association_result').text('Wrong!');
    }
    left_active.attr('active','false');
    right_active.attr('active','false');
    if ($('#association_left_column').children('[done="true"]').length == 4){
        $('#association_left_column').children('[done="true"]').each(function(){
            if ($(this).attr('failed') == 'false'){
                correct_associations++;
            }
        });
        total_associations += 4;
        update_progress_bar('#association_game',correct_associations,total_associations,false);
        $('.association_word').attr('done','false');
        $('.association_word').attr('active','false');
        update_association_game();
    }
    $('#association_result').animate({ opacity: 1 });
    setTimeout(function() {
        $('#association_result').animate({ opacity: 0 });
    }, 2500);

}

function update_game_guess() {
    $('#guess_game .check_text.left').text('english to ' + languages[lang_i]);
    $('#guess_game .check_text.right').text(languages[lang_i] + ' to english');
    if (guess_index >= shuffled_list.length) {
        return;
    }
    var word = shuffled_list[guess_index];

    var lang_param = lang_params[lang_i];
    var word_attr = word[lang_param + '_words'].replace(/,/g,", ");
    if (word_attr.length > 0){
        var existing_words = $('.word[' + lang_param + '_words="' + word_attr + '"]');
        if (existing_words.length > 1){
            existing_words.each(function(j,obj){
                var existing_word = $(obj).attr('en_words');
                if (word['en_words'].includes(existing_word) == false){
                    word['en_words'] = word['en_words'] + ',' + existing_word;
                }
            });
        }
    }
    var words = [word.ka_words,word.ru_words,word.fr_words,word.kr_words,word.jp_words,word.en_words];
    if (lang_to_en){
        $("#guess_word p").text(words[lang_i]);
    }
    else{
        var txt = words[5];
        if (word.type == 'v'){
            txt = 'to ' + words[5];
        }
        $("#guess_word p").text(txt);
    }
    $('#guess_word').attr('type', word.type);
    $('#guess_word').attr('en_words', word.en_words);
    $('#guess_word').attr('ka_words', word.ka_words);
    $('#guess_word').attr('fr_words', word.fr_words);
    $('#guess_word').attr('ru_words', word.ru_words);
    $('#guess_word').attr('kr_words', word.kr_words);
    $('#guess_word').attr('jp_words', word.jp_words);
    var ka_word = word.ka_words.replace(/,/g,", ");
    var col = $('.word[ka_words="' + ka_word + '"]').css('background-color');
    var col_r = col.split(',')[0].split('(')[1];
    var col_g = col.split(',')[1];
    var col_b = col.split(',')[2].split(')')[0];
    var col_idx = ['#fbc59f','#f4eb84','#c499e0','#f39f95','#a9e3bb','#a6cdf4','#e6b8b8'].indexOf(rgbToHex(col_r,col_g,col_b));
    $('#guess_word').attr('class','col' + (col_idx+1));
    $("#guess_input").val("");
    $('#guess_word').off("click");
    if (lang_to_en){
        var word_to_say = words[lang_i].replace(',',' ');
        $('#guess_word').click({letter:word_to_say},play_word_sound);
    }
}

function update_progress_bar(game_id,cg,tg,percent) {
    var progress = cg / shuffled_list.length * 100;
    var progress_total = tg / shuffled_list.length * 100;
    var good_guesses = cg / tg * 100;
    if (tg == 0) {
        good_guesses = 0;
    }
    $(game_id + " .progress_div").css("height", 'fit-content');
    $(game_id + " .progress_div").css("margin-bottom", '35px');
    $(game_id + " .progress_div .progress").css("width", progress + "%");
    $(game_id + " .progress_div .progress_total").css("width", progress_total + "%");
    if (percent){
        $(game_id + " .progress_div p").text(cg + " / " + tg + " (" + good_guesses.toFixed(0) + "%)");
    }
    else{
        $(game_id + " .progress_div p").text(cg + " / " + tg);
    }
    $(game_id + ' .progress_div p').css('left', progress + '%');
    $(game_id + ' .progress_div p').css('opacity', 1);
    $(game_id + ' .progress_div').css('opacity', 1);
}

function play_audio_index(url,time){
    setTimeout(function() {
        var audio = new Audio(url);
        audio.play();
    }, time * 1000);
}

function play_word_sound(){
    if (arguments[0].data == undefined){
        if (lang_i == 2){
            if ($(this).attr('fr_pron') == '-'){
                return;
            }
            var letters = JSON.parse($(this).attr('fr_pron'));
        }
        else{
            var letters = $(this).attr(lang_params[lang_i] + '_words').split("");
        }
    }
    else{
        letters = arguments[0].data.letter.split('');
    }
    var total_duration = 0;
    var alphabet = pron_alphabets[lang_i];
    for (var i = 0; i < letters.length; i++) {
        if (letters[i] == " ") {
            total_duration += 0.25;
            continue;
        }
        else if (alphabet.indexOf(letters[i].toLowerCase()) == -1) {
            continue;
        }
        var letter = letters[i].toLowerCase();
        var url = base_url + '/src/sounds/' + languages[lang_i] + '/word_sounds/' + letter + '.mp3';
        var audio = new Audio(url);
        audio.src = url;
        play_audio_index(url,total_duration);
        total_duration += letter_duration[alphabet.indexOf(letter)];
    }
}

function play_letter_sound(){
    navigator.clipboard.writeText($(this).attr('sound'));
    var audio = new Audio(base_url + '/src/sounds/' + languages[lang_i] + '/letter_sounds/' + $(this).attr('sound') + '.mp3');
    audio.play();
}

function get_audio_duration(audio,i){
    $(audio).on("loadedmetadata", function(){
        letter_duration[i] = Math.max(audio.duration,0.15);
    });
}

function shuffleArray(array) {
    var newArray = array.slice();
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }