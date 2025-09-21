const get_most_mistakes_word_list = () => {
    const sorted_list = [...words_list].map(word => {
        let ratio;
        if (word.occs === 0 && word.occs_ok === 0) {
            ratio = 0.0;
        } else {
            ratio = (1.0 + word.occs_ok) / (1.0 + word.occs);
        }
        return { ...word, ratio };
    }).sort((a, b) => a.ratio - b.ratio);

    const grouped = sorted_list.reduce((acc, word) => {
        acc[word.ratio] = acc[word.ratio] || [];
        acc[word.ratio].push(word);
        return acc;
    }, {});

    const final_list = Object.entries(grouped)
        .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
        .flatMap(([_, group]) => shuffleArray(group));
    return final_list;
};



const add_xp_word = (word, is_ok) => {
    const url = "/php/add_occurence.php";
    $.post(url, { word, is_ok });
    set_xp_nav();
};

const add_xp = xp => {
    const url = "/php/add_xp.php";
    $.post(url, { xp });
    set_xp_nav();
};

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
            var date = parts[9].trim() + ':' + parts[10].trim() + ':' + parts[11].trim();
            if (occs == ''){
                occs = 0;
            }
            else{
                occs = parseInt(occs);
            }
            if (occs_ok == ''){
                occs_ok = 0;
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
                date: date,
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
                wordElement.attr('date'    , date   );
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

function update_word_list(){
    var searchValue = $('#search_bar').val().toLowerCase();
    var filters = [false,false,false,false];
    $('#words #search_filters .filter').each(function(i,e){
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
        if (lang_words[lang_i].includes(searchValue) || en_words.includes(searchValue) || lang_words[lang_i].includes(latin_to_cyrillic(searchValue))){
            var type_i = ['n','v','a','o'].indexOf(type);
            if ((filters[type_i]) || (filters.includes(true) == false)){
                if ($('#words #search_filters .tag-filter p').html() != 'tags'){
                    if ($(this).attr('tags').split(',').includes($('#words #search_filters .tag-filter p').html())){
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