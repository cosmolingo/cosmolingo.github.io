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

//WORDLE GAME

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

//GUESS GAME

$('#guess_game_lang_check').on('change', function() {
        lang_to_en = $(this).is(':checked');
        shuffled_list = get_most_mistakes_word_list();
        guess_index++;
        update_game_guess();
});

function update_game_guess() {
    $('#guess_game .check_text.left').text('english to ' + languages[lang_i]);
    $('#guess_game .check_text.right').text(languages[lang_i] + ' to english');
    if (guess_index >= shuffled_list.length) {
        return;
    }
    var word = shuffled_list[guess_index];

    var filters = [false,false,false,false];
    $('#guess_game #search_filters .filter').each(function(i,e){
        filters[i] = $(e).attr('active') == 'true';
    });

    var type_i = ['n','v','a','o'].indexOf(word.type);

    if (filters.includes(true) && !filters[type_i]){
        guess_index++;
        update_game_guess();
        return;
    }

    if ($('#guess_game #search_filters .tag-filter p').html() != 'tags'){
        if (word.tags.includes($('#guess_game #search_filters .tag-filter p').html()) == false){
            guess_index++;
            update_game_guess();
            return;
        }
    }

    // Filter by date range
    var startDate = Date.parse($('#start_guess_date').val());
    var endDate = Date.parse($('#end_guess_date').val());
    var wordDate = Date.parse(word.date.split(' ')[0]);
    if (startDate && wordDate < startDate) {
        guess_index++;
        update_game_guess();
        return;
    }
    if (endDate && wordDate > endDate) {
        guess_index++;
        update_game_guess();
        return;
    }

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
                shuffled_list = get_most_mistakes_word_list();
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
        if (sol_words_possible.includes(guess) || sol_words_possible.includes(latin_to_cyrillic(guess))){
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

$(document).on('change','.guess_date',function(e){
    guess_index = 0;
    shuffled_list = get_most_mistakes_word_list();
    update_game_guess();
});

//ASSOCIATION GAME

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

//CLOTHES

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

$(document).on('mousemove','.clothes',function(e){
    clothes_info();
});

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

//BODY

function create_body_diagram(){
    if ($('.body_parts').length == 0){
        return;
    }
    var url = "/src/body/body_parts.svg";
    
    $('#body_diagrams').load(url);
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

$(document).on('click','.body_parts',function(e){
    body_info();
});

$(document).on('mousemove','.body_parts',function(e){
    body_info();
});

//COLORS

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

//CLOCK

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

//WEATHER

function populate_weather(){
    if ($('.weather').length == 0){
        return;
    }
    $.get( "php/weather.php", function( data ) {
        var weather = data['dataseries'];
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

//NUMBERS

const setup_number_game = () => {
    const random_number = Math.floor(Math.random() * 10000);
    $('#number_game_output').html('<p>' + random_number + '</p>');
    $('#number_game_output').attr('translated_number', get_spelled_out_number(random_number));
    const rand_number = Math.floor(Math.random() * 7) + 1;
    $('#number_game_output').attr('class', 'button_' + rand_number);
    $('#number_game_input').val('');
};

const check_number_game = () => {
    const input = $('#number_game_input').val();
    game_timeout = setTimeout(() => {
        $('#number_game_result').delay(2000).animate({ opacity: 0 }, { queue: false });
    }, 2000);
    $('#number_game_result').animate({ opacity: 1 }, { queue: false });
    if (input == $('#number_game_output').attr('translated_number') || latin_to_cyrillic(input) == $('#number_game_output').attr('translated_number')) {
        add_xp(2);
        setup_number_game();
        $('#number_game_result').text('Correct!');
    } else {
        $('#number_game_result').text('Wrong! Click the number to skip.');
    }
};

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