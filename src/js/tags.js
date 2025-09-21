function update_tag_filter(){
    var tag_div = $('.tags_list');
    for (var i = 0; i < tag_list.length; i++){
        var tag = $("<div>").text(tag_list[i]);
        tag.addClass('tag');
        tag_div.append(tag);
    }
    position_tag_list();
}

$(document).on('click','.filter_tags',function(e){
    if ($(this).siblings('.tags_list').is(':visible')){
        $(this).attr('active','false');
        $(this).siblings('.tags_list').fadeOut();
    }
    else{
        $(this).attr('active','true');
        $(this).siblings('.tags_list').fadeIn();
    }
});

$(document).on('click','.tag',function(e){
    var filter = 'tags';
    if ($(this).html() != 'all'){
        filter = $(this).html();
    }
    else{
        $(this).parent().siblings('.filter_tags').attr('active','false');
    }
    $(this).parent().siblings('.tag-filter').children('p').html(filter);
    $(this).parent().fadeOut();
    if ($(this).parent().parent().parent().attr('id') == 'words'){
        update_word_list();
    }
    else if ($(this).parent().parent().parent().attr('id') == 'guess_game'){
        guess_index = 0;
        shuffled_list = get_most_mistakes_word_list();
        update_game_guess();
    }
});

$(document).on('click','.filter',function(e){
    $(this).attr('active',$(this).attr('active') == 'true' ? 'false' : 'true');
    if ($(this).parent().parent().attr('id') == 'words'){
        update_word_list();
    }
    else if ($(this).parent().parent().attr('id') == 'guess_game'){
        guess_index = 0;
        shuffled_list = get_most_mistakes_word_list();
        update_game_guess();
    }
});

$(window).resize(function() {
    position_tag_list();
});

function position_tag_list(){
    $('.tags_list').each(function() {
        var filter_tags = $(this).siblings('.filter_tags');
        var top = filter_tags.offset().top + filter_tags.outerHeight() - 30 - $(this).parent().offset().top;
        var left = filter_tags.offset().left + filter_tags.outerWidth() / 2 - $(this).outerWidth() / 2 - $(this).parent().offset().left;
        $(this).css({ top: top, left: left });
    });
}