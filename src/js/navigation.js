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

$(document).ready(function() {
    var nav_items = ["words", "games", "grammar", "leaderboard", "word_list", "profile"];
    var nav_icons = ["fa-language", "fa-gamepad", "fa-scroll", "fa-chart-simple", "fa-list", "fa-user"];
    var nav_texts = ["words", "toys", "grammar", "leaderboard", "word list", "login"];
    var current_page_name = window.location.href.split("/").pop().split("?")[0];
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