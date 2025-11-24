<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1">
    <link rel="icon" href="" type="image/x-icon">
    <title>profile</title>
    <script src="https://code.jquery.com/jquery-3.6.0.js"></script>
    <script src="https://code.jquery.com/ui/1.14.1/jquery-ui.js"></script>
    <link rel="stylesheet" href="../style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Balsamiq+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Cherry+Bomb+One&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Sniglet:wght@800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Single+Day&display=swap" rel="stylesheet">
    <script src="https://kit.fontawesome.com/1c5060d9dc.js" crossorigin="anonymous"></script>
    <script src="../src/js/navigation.js"></script>
    <style>
        #title{
            margin-bottom: 200px;
        }

        #title i{
            font-size:40px;
            transform: translateY(-3px);
        }

        #title i:nth-child(1){
            margin-right: 10px;
            transform: scaleX(-1) translateY(-3px);
        }

        #title i:nth-child(2){
            margin-left: 10px;
        }

        #leaderboard_container{
            margin:0 auto;
            width:fit-content;
            text-align: center;
        }

        .leaderboard{
            text-align: center;
            display: inline-block;
            margin-left: 25px;
            margin-right: 25px;
        }

        .leaderboard h3{
            font-size: 25px;
            font-weight: bold;
            margin-top: 0px;
            margin-bottom: 0px;
        }

        .leaderboard p{
            margin-top: 0px;
        }

        .leaderboard select{
            margin-top: 0px;
        }

        .lang_title{
            margin-top: 0px;
            margin-bottom: 0px;
        }
    </style>
</head>
<body>
<div id="wave_top">
    <svg viewBox="0 0 1000 150" preserveAspectRatio="none" style="height: 100%; width: 100%;">
        <path d="M1000,101.71c0,0-106.81-108.65-238.66,0s-261.34,0-261.34,0s-106.81-108.65-238.66,0S0,101.71,0,101.71V0h1000 V101.71z" style="stroke: none;fill: #f2e269;"></path>
    </svg>
</div>
<div id="title">
    <h1><i class="fa-solid fa-user"></i>profile<i class="fa-solid fa-user"></i></h1>
</div>
<div id="navigation"></div>
<div id="leaderboard_container">
<div class="leaderboard"><img class="avatar"><h3 class="username"></h3><p class="score"></p></div>
<br/>
<p class="lang_title">Learning language:</p>
<select id="language_select" class="button">
    <option value="ka">Kazakh</option>
    <option value="fr">French</option>
    <option value="ru">Russian</option>
    <option value="kr">Korean</option>
    <!--
    <option value="jp">Japanese</option>
    -->
</select>
<br/>
<button id="logout_button" class='button'>Logout</button>
</div>
<div id="wave_bottom">
    <svg viewBox="0 0 1000 150" preserveAspectRatio="none" style="height: 100%; width: 100%;">
        <path d="M1000,48.29c0,0-106.81,108.65-238.66,0s-261.34,0-261.34,0s-106.81,108.65-238.66,0S0,48.29,0,48.29V150h1000 V48.29z" style="stroke: none;fill: #f2e269;"></path>
    </svg>
</div>
<script>
    $('#logout_button').click(function(){
        document.cookie = "sessionID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "../index.html";
    });

    $(document).on('click', '#new_category_button', function() {
        var categoryName = $('#category_name').val().trim();
        if (categoryName === "") {
            alert("Category name cannot be empty");
            return;
        }
        $.ajax({
            url: 'add_category.php',
            type: 'POST',
            data: { name: categoryName },
            success: function(response) {
                location.reload();
            },
            error: function(xhr, status, error) {
                console.error("Error creating category:", error);
            }
        });
    });

    // Function to delete a category
    function deleteCategory(categoryId, categoryName) {
        if (!confirm("Are you sure you want to delete the category '" + categoryName + "'?")) return;
        $.ajax({
            url: 'remove_category.php',
            type: 'POST',
            data: { category_id: categoryId },
            success: function(response) {
                location.reload();
            },
            error: function(xhr, status, error) {
                console.error("Error deleting category:", error);
            }
        });
    }

    $(document).ready(function(){
        $.ajax({
            url: 'get_user_info.php',
            type: 'GET',
            success: function(data) {
                // Append categories before language selection
                if (data.categories) {
                    var $container = $('#leaderboard_container');
                    var $catDiv = $('<div class="table_div" id="user_categories"><p class="lang_title">Your categories:</p></div>');
                    var $table = $('<table class="table"><tbody><tr><th>Name</th><th>Number of words</th><th>Action</th></tr></tbody></table>');
                    data.categories.forEach(function(cat) {
                        var $tr = $('<tr></tr>');
                        var $nameTd = $('<td>' + cat.name + '</td>');
                        var $countTd = $('<td>' + (cat.word_count !== undefined ? cat.word_count : '-') + '</td>');
                        var $delTd = $('<td style="padding:4px 8px;text-align:center;"></td>');
                        var $delBtn = $('<button class="button remove_button delete_category_btn"><i class="fa-solid fa-xmark"></i></button>');
                        $delBtn.click(function() {
                            deleteCategory(cat.id, cat.name);
                        });
                        $delTd.append($delBtn);
                        $tr.append($nameTd).append($countTd).append($delTd);
                        $table.find('tbody').append($tr);
                    });
                    $table.find('tbody').append('<tr><td><input type="text" class="text_box" id="category_name" name="category_name" placeholder="Category name"/></td><td></td><td><button type="submit" class="add_button button" id="new_category_button">Create</button></td></tr>')
                    var $ul = $table;
                    $catDiv.append($ul);
                    // Insert after the new_category_button
                    $container.find('.lang_title').before($catDiv);
                }
                $('#language_select').val(data.default_lang.toLowerCase());
                $('.leaderboard .avatar').attr('src', "../src/avatars/" + data.username.toLowerCase() + ".png");
                $('.leaderboard .username').text(data.username.toLowerCase());
                $('.leaderboard .score').text(data.score + " xp");
            },
            error: function(xhr, status, error) {
                console.error("Error fetching profile data:", error);
            }
        });
    });

    $('#language_select').change(function(){
        var selectedLanguage = $(this).val();
        $.ajax({
            url: 'update_user_default_lang.php',
            type: 'POST',
            data: { default_lang: selectedLanguage },
            error: function(xhr, status, error) {
                console.error("Error updating language:", error);
            }
        });
    });
</script>
</body>
</html>