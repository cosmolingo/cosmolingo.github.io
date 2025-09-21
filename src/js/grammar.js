$(document).on('click','#grammar h2',function(e){
    $(this).attr('active',$(this).attr('active') == 'true' ? 'false' : 'true');
    if ($(this).attr('active') == 'true'){
        $(this).siblings('.section_content').css('max-height','5000px');
    }
    else{
        $(this).siblings('.section_content').css('max-height','0px');
    }
});

//TENSES

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

//TIME

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

