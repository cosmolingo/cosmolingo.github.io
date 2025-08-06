var alphabets = [
    ["а","ә","б","в","г","ғ","д","е","ж","з","и","й","к","қ","л","м","н","ң","о","ө","п","р","с","т","у","ұ","ү","ф","х","һ","ц","ч","ш","щ","ы","і","э","ю","я"],
    ["а","б","в","г","д","е","ё","ж","з","и","й","к","л","м","н","о","п","р","с","т","у","ф","х","ц","ч","ш","щ","ъ","ы","ь","э","ю","я"],
    ["a","b","c","d","e","é","è","ê","ë","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"],
    [],
    []
];
var current_page_name = window.location.href.split("/").pop().split("?")[0];
var lang_params = ['ka','ru','fr','kr','jp'];
var lang_i = 0;

let focusedInput = null;
$(document).on('focusin', function(event) {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        focusedInput = $(event.target);

        // Only run on word_list.php
        if (current_page_name === "word_list.php") {
            setup_keyboard();
        }
    }
});

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

function set_xp_nav(){
    var url = '/php/get_xp.php';
    $.get(url).then(function(data) {
        var new_xp = data;
        var old_xp = parseInt($('#user_xp').text().split('xp')[0]);
        if (new_xp != old_xp){
            $('#nav_profile').css('transform',' scale(1.1)');
            setTimeout(function(){
                $('#nav_profile').css('transform',' scale(1)');
            }, 200);

            $('#user_xp').text(data + 'xp');
        }
    });
}

function add_letter_to_input(event){
    var letter = $(this).text();

    var input_value = focusedInput.val();
    var input_value = input_value + letter;
    focusedInput.val(input_value);
    focusedInput.focus();
    focusedInput.trigger('input');
}

function setup_keyboard() {
    var lang_idx = 0;
    if (current_page_name == "" || current_page_name == "index.html") {
        lang_idx = lang_i;
    }
    // Only run if focusedInput exists and is inside a table cell
    if (current_page_name == "word_list.php" && focusedInput && focusedInput.closest('td').length > 0){
        var cell = focusedInput.closest('td');
        var row = cell.closest('tr');

        // Find the index of the cell in the row
        var cellIndex = cell.index();

        // Find the corresponding header text (th) for this cell
        var table = row.closest('table');
        var headerText = table.find('th').eq(cellIndex).text().trim();

        if (headerText === "Russian") {
            lang_idx = 1;
        }
        else if (headerText === "French") {
            lang_idx = 2;
        }
        else {
            lang_idx = 0;
        }
    }

    var alphabet = alphabets[lang_idx];
    $("#keyboard .letter").remove();
    for (var i = 0; i < alphabet.length; i++) {
        var ltr = alphabet[i];
        var letter = $("<div>").html('<p>' + ltr + '</p>');
        letter.addClass("letter");
        letter.on("click", add_letter_to_input);
        $("#keyboard").append(letter);
    }
    $('#keyboard').draggable({
        handle: ".keyboard_header",
        containment: "window",
    });
}

let lastScrollY = $(window).scrollTop();
let targetY = lastScrollY;
function animateKeyboardButton() {
    // Smoothly interpolate towards the target scroll position
    lastScrollY += (targetY - lastScrollY) * 0.1;
    $('#keyboard_button').css('transform', 'translateY(' + lastScrollY + 'px)');
    requestAnimationFrame(animateKeyboardButton);
}
$(window).on('scroll', function() {
    targetY = $(window).scrollTop();
});

// Start the animation loop
animateKeyboardButton();

$(document).ready(function() {
    var url_lang = getUrlParameter('lang');
    if (url_lang != false){
        lang_i = lang_params.indexOf(url_lang);
        if (lang_i == -1){
            lang_i = 0;
        }
    }
    else{
        var url = '/php/get_user_info.php';
        $.get(url).then(function(data){
            lang_i = lang_params.indexOf(data.default_lang);
            if (lang_i == -1){
                lang_i = 0;
            }
        });
    }
    var current_page_name = window.location.href.split("/").pop().split("?")[0];
    if (current_page_name === "index.html" || current_page_name == "" || current_page_name === "word_list.php") {
        setup_keyboard();

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
    }
    
    var nav_items = ["words", "games", "grammar", "leaderboard", "word_list", "profile"];
    var nav_icons = ["fa-language", "fa-gamepad", "fa-scroll", "fa-chart-simple", "fa-list", "fa-user"];
    var nav_texts = ["words", "toys", "grammar", "leaderboard", "word list", "login"];
    if (current_page_name == 'login.html'){
        var links = ["index.html", "index.html?section=toys", "index.html?section=grammar", "php/leaderboards.php", "php/word_list.php", ""];
    }
    else if (current_page_name.includes('php') == false){
        var links = ["", "", "", "/php/leaderboards.php", "/php/word_list.php", "login.html"];
    }
    else if (current_page_name == 'leaderboards.php'){
        var links = ["../index.html", "../index.html?section=toys", "../index.html?section=grammar", "", "word_list.php", "../login.html"];
    }
    else if (current_page_name == 'word_list.php'){
        var links = ["../index.html", "../index.html?section=toys", "../index.html?section=grammar", "leaderboards.php", "", "../login.html"];
    }
    else if (current_page_name == 'profile.php' || current_page_name == 'login.html'){
        var links = ["../index.html", "../index.html?section=toys", "../index.html?section=grammar", "leaderboards.php", "word_list.php", ""];
    }
    if (getCookie('username') != ''){
        nav_texts[5] = getCookie('username') + '<span id="user_xp">0xp</span>';
        if (links[5] != ''){
            if (current_page_name.includes('php') == false){
                links[5] = "php/profile.php";
            }
            else{
                links[5] = "profile.php";
            }
        }
    }
    else{
        links[4] = "login.html";
    }
    for (var i = 0; i < 6; i++) {
        var nav_item = document.createElement("div");
        nav_item.className = "nav_item";
        nav_item.id = "nav_" + nav_items[i];
        if (links[i] != ''){
            var link = document.createElement("a");
            link.href = links[i];
        }
        var icon = document.createElement("i");
        icon.className = "fa-solid " + nav_icons[i];
        var text = document.createElement("p");
        text.innerHTML = nav_texts[i];
        if (links[i] != ''){
            link.appendChild(icon);
            link.appendChild(text);
            nav_item.appendChild(link);
        }
        else{
            nav_item.appendChild(icon);
            nav_item.appendChild(text);
        }
        $("#navigation").append(nav_item);
    }
    if (getCookie('username') != ''){
        set_xp_nav();
    }
});