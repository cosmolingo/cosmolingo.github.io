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

// Modular setup steps for easy extension
const setupSteps = [
    () => $('#end_guess_date').val(new Date().toISOString().split('T')[0]),
    () => $('.test_clock').clockTimePicker(),
    () => {
        document.documentElement.style.setProperty("--primary-color", colors[lang_i][0]);
        document.documentElement.style.setProperty("--secondary-color", colors[lang_i][1]);
        $('#wave_top path').attr('style','stroke: none;fill: '+colors[lang_i][0]+';');
        $('#wave_bottom path').attr('style','stroke: none;fill: '+colors[lang_i][0]+';');
        $('#title h1').html('<i class="' + languages[lang_i] + '" ></i>   my <div id=title_dropdown active="false">' + languages[lang_i] + '<i class="fa-solid fa-sort-down"></i></div> words   <i class="' + languages[lang_i] + '" ></i>');
        $('link[rel="icon"]').attr('href', base_url + '/src/symbols/' + languages[lang_i] + '.ico');
        const meta = document.querySelector("meta[name='theme-color']");
        if (meta) {
            meta.setAttribute("content", colors[lang_i][0]);
        }
    },
    // Async grammar/section fetch and dependent setup
    async function grammarAndSectionSetup() {
        const url = "/sections/" + languages[lang_i] + ".html";
        const data = await $.get({url: url, cache: false});
        let lines = data.split('\n');
        lines.splice(0,16);
        lines.splice(-2,2);
        const grammarHtml = lines.join('\n');
        $('#grammar .section_content').html(grammarHtml);
        $('.game_section').detach().appendTo('#games .section_content');
        if ($('.grammar_section').length == 0){
            $('#grammar').remove();
        }
        get_words();
        populate_numbers();
        $('#number_output p').text(special_numbers[lang_i][0]);
        setup_number_game();
        setup_toys();
    },
    () => {
        $('#number_game_input').on('keydown', function(e) {
            if (e.key === "Enter") check_number_game();
        });
        $('#number_game_output').click(setup_number_game);
    },
    () => {
        $('#title_dropdown').click(function(){
            const is_toggle_active = $('#title_dropdown').attr('active');
            if (is_toggle_active == 'false'){
                $('#flags_div').animate({top: '70px'}, 200);
                $('#title_dropdown').attr('active','true');
            } else {
                $('#flags_div').animate({top: '0px'}, 200);
                $('#title_dropdown').attr('active','false');
            }
        });
        $('#nav_words').click(function(){
            $('html, body').animate({ scrollTop: $("#search_bar_div").offset().top }, 1000);
        });
        $('#nav_grammar').click(function(){
            $('html, body').animate({ scrollTop: $("#grammar").offset().top }, 1000);
        });
        $('#nav_games').click(function(){
            $('html, body').animate({ scrollTop: $("#games").offset().top }, 1000);
        });
    }
];

async function setup_all() {
    for (const step of setupSteps) {
        if (typeof step === 'function') {
            // Await if the step is async
            const result = step();
            if (result instanceof Promise) await result;
        }
    }
}

$(document).ready(() => {
    section = getUrlParameter('section');
    if (window.location.pathname.endsWith("index.html")) {
        const newPath = window.location.pathname.replace("index.html", "");
        const newUrl = window.location.origin + newPath + window.location.search + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
    }
    const url_lang = getUrlParameter('lang');
    if (url_lang !== false) {
        lang_i = lang_params.indexOf(url_lang);
        if (lang_i === -1) lang_i = 0;
        setup_all();
    } else {
        const url = '/php/get_user_info.php';
        $.get(url).then(data => {
            lang_i = lang_params.indexOf(data.default_lang);
            if (lang_i === -1) lang_i = 0;
            setup_all();
        });
    }
});

(function() {
    const waveInner = document.getElementById('wave_top_inner');
    if (!waveInner) return;
    const svg = waveInner.querySelector('svg');
    if (!svg) return;

    let offset = 0;
    const speedFractionPerSecond = 0.2; // fraction of svg width moved per second (adjust to taste)
    let lastTs = null;

    function getSvgWidth() {
        return svg.clientWidth / 2; // preserve original half-width behaviour
    }

    function animate(ts) {
        if (!lastTs) lastTs = ts;
        const dt = (ts - lastTs) / 1000; // seconds
        lastTs = ts;

        const svgWidth = getSvgWidth();
        const movement = speedFractionPerSecond * svgWidth * dt;
        offset -= movement;

        // wrap offset to keep it within one svg width for smooth looping
        while (Math.abs(offset) >= svgWidth) {
            offset += (offset < 0 ? svgWidth : -svgWidth);
        }

        waveInner.style.transform = `translateX(${offset}px)`;
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
})();

(function() {
    const waveInner = document.getElementById('wave_bottom_inner');
    if (!waveInner) return;
    const svg = waveInner.querySelector('svg');
    if (!svg) return;

    let offset = 0;
    const speedFractionPerSecond = 0.2; // same fraction as top wave
    let lastTs = null;

    function getSvgWidth() {
        return svg.clientWidth; // preserve original full-width behaviour
    }

    function animate(ts) {
        if (!lastTs) lastTs = ts;
        const dt = (ts - lastTs) / 1000;
        lastTs = ts;

        const svgWidth = getSvgWidth();
        const movement = speedFractionPerSecond * svgWidth * dt;
        offset -= movement;

        while (Math.abs(offset) >= svgWidth) {
            offset += (offset < 0 ? svgWidth : -svgWidth);
        }

        waveInner.style.transform = `translateX(${offset}px)`;
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
})();