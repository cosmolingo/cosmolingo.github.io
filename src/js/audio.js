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