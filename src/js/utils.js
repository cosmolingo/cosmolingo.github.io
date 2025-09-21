document.addEventListener('focusin', function(event) {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        focusedInput = $(event.target);
    }
});

var getUrlParameter = sParam => {
    const sPageURL = window.location.search.substring(1);
    const sURLVariables = sPageURL.split('&');
    for (let i = 0; i < sURLVariables.length; i++) {
        const sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

const latin_to_cyrillic = word => {
    let translated_word = '';
    word = word.split(',');
    for (let i = 0; i < word.length; i++) {
        const symbol = word[i];
        if (ka_lat_alphabet.includes(symbol)) {
            const idx = ka_lat_alphabet.indexOf(symbol);
            translated_word += alphabets[0][idx];
        } else {
            translated_word += symbol;
        }
    }
    return translated_word;
};


function get_closest_color(h,s,v){
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

function play_audio_index(url,time){
    setTimeout(function() {
        var audio = new Audio(url);
        audio.play();
    }, time * 1000);
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

function get_lang_attr(lang_i){
    var attr = lang_params[lang_i] + '_words';
    return attr;
}