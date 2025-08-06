<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1">
    <link rel="icon" href="" type="image/x-icon">
    <title>words list</title>
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
            margin-bottom:200px;
        }

        table {
            width: 90%;
            border-collapse: collapse;
            margin: 0 auto;
            border-collapse: collapse;
            font-size:20px;
            border:1px solid #5a4813;
            border-collapse:collapse;
            margin:0 auto;
            margin-bottom:75px;
            border-radius:5px;
            border-spacing: 0;
            border-collapse: separate;
            border-radius: 10px;
            border:1.5px solid #5a4813;
            border-bottom: 3px solid #5a4813;
            box-shadow:0 5px 10px rgba(0,0,0,0.1);
        }

        table th:not(:last-child),
        table td:not(:last-child){
            border-right: 1px solid black;
        }

        table th{
            background-color: var(--primary-color);
            height:45px;
            text-align:center;
        }

        table>thead>tr:not(:last-child)>th,
        table>thead>tr:not(:last-child)>td,
        table>tbody>tr:not(:last-child)>th,
        table>tbody>tr:not(:last-child)>td,
        table>tfoot>tr:not(:last-child)>th,
        table>tfoot>tr:not(:last-child)>td,
        table>tr:not(:last-child)>td,
        table>tr:not(:last-child)>th,
        table>thead:not(:last-child),
        table>tbody:not(:last-child),
        table>tfoot:not(:last-child) {
            border-bottom: 1px solid black;
        }

        th, td {
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        td{
            background-color: #e7e0c4;
        }

        textarea {
            resize: none;
            border: none;
            background-color: transparent;
            font-family: 'Balsamiq Sans', cursive;
            width:100%;
            color:rgb(90, 72, 19);
            font-size: 16px;
        }

        td:nth-child(1) textarea,th:nth-child(1),td:nth-child(2) textarea,th:nth-child(2) {
            width: 60px;
        }

        td:nth-child(3) textarea,th:nth-child(3) {
            width: 100px;
        }
               
        table tr:last-child td {
            border-bottom: 0;
        }
        table tr td:first-child,table tr td:nth-child(2){
            border-left: 0;
        }
        table tr td:last-child{
            border-right: 0;
        }

        table td:first-child{
            text-align: right;
        }

        #add_word{
            margin: 0 auto;
            display: block;
            background-color: #f4eb84;
        }

        #new_word{
            margin-bottom: 25px;
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

        h2{
            cursor: auto;
        }

        #word_list td:last-child{
            text-align: center;
        }

        .remove_button{
            background-color: #f39f95 !important;
            margin-bottom: 0px;
        }

        #show-dialog{
            margin:0 auto;
            display:block;
            margin-top: 25px;
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
    <h1><i class="fa-solid fa-signature"></i>word list<i class="fa-solid fa-signature"></i></h1>
</div>

<div id="keyboard_button" active="false">
    <i class="fa-solid fa-keyboard"></i>
    <p>keyboard</p>
</div>

<div id="keyboard" style="display:none">
    <div class="keyboard_close">
        <i class="fa-solid fa-xmark"></i>
    </div>
    <div class="keyboard_header"><i class="fa-solid fa-bars"></i></div>
</div>

<div id="navigation"></div>
<h2>add a word</h2>
<div class="table_div">
    <table id='new_word'>
        <tr>
            <th>Type</th>
            <th>Gender</th>
            <th>Tag</th>
            <th>English</th>
            <th>Kazakh</th>
            <th>Russian</th>
            <th>French</th>
            <th>Korean</th>
            <th>Japanese</th>
            <th>Pronunciation</th>
        </tr>
        <tr>
            <td><textarea></textarea></td>
            <td><textarea></textarea></td>
            <td><textarea></textarea></td>
            <td><textarea></textarea></td>
            <td><textarea></textarea></td>
            <td><textarea></textarea></td>
            <td><textarea></textarea></td>
            <td><textarea></textarea></td>
            <td><textarea></textarea></td>
            <td><textarea></textarea></td>
        </tr>
    </table>
</div>
<button class="button" onclick="submit_word()" id="add_word">Add new word</button>

<button class='button' id="show-dialog">Add multiple words</button>
<dialog id="dialog">
  <form method="dialog">
    <p>
      <label>
        Word list (type-gender;tag:english:kazakh:french(pronunciation):russian:korean:japanese) :
    </label>
    <br/>
    <textarea id="word_list_textarea" rows="10" cols="50"></textarea>
    </p>
    <div>
      <input type="button" id="js-close" value="Submit word list" />
    </div>
  </form>
</dialog>

<script>
    const showBtn = document.getElementById("show-dialog");
    const dialog = document.getElementById("dialog");
    const jsCloseBtn = dialog.querySelector("#js-close");

    showBtn.addEventListener("click", () => {
        dialog.showModal();
    });

    jsCloseBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const wordListTextarea = document.getElementById("word_list_textarea");
        const wordList = wordListTextarea.value.split("\n");
        const ajaxPromises = wordList.map((word) => {
            const line = parseLine(word.trim());
            return $.ajax({
                type: 'POST',
                url: 'add_word.php',
                data: { 
                    type: line[0],
                    gender: line[1],
                    tag: line[2],
                    english: line[4],
                    kazakh: line[3],
                    russian: line[7],
                    french: line[5],
                    korean: line[8],
                    japanese: line[9],
                    pronunciation: line[6]
                },
            });
        });
        Promise.all(ajaxPromises).then(() => {
            location.reload();
        }).catch((error) => {
            console.error("An error occurred:", error);
        });
    });

    function parseLine(line){
        if (line.length == 0) {
            return;
        }
        var parts = line.split(":");
        var type  = parts[0].trim();
        var tags = [];
        var genders = [];
        if (type.includes(';')){
            tags = type.split(';')[1];
            type = type.split(';')[0];
        }
        if (type.includes('-')){
            genders = type.split('-')[1];
            type = type.split('-')[0];
        }
        if (parts[3].includes('(')){
            var pron = parts[3].split('(')[1];
            pron = pron.split(')')[0];
            parts[3] = parts[3].split('(')[0];
        }
        else{
            var pron = '';
        }
        var ka_words = parts[1].trim();
        var en_words = parts[2].trim();
        var fr_words = parts[3].trim();
        var ru_words = parts[4].trim();
        var ko_words = parts[5].trim();
        var jp_words = parts[6].trim();

        return [type,genders,tags,ka_words,en_words,fr_words,pron,ru_words,ko_words,jp_words];
    }
</script>

<h2>words list</h2>
<button id="save-changes" class="button" disabled style="cursor:not-allowed;opacity:0.5;display:block;margin:0 auto;background-color:#a9e3bb">No changes to be saved</button>
<br/>
<div class="table_div">
    <table id='word_list'>
    <tr>
        <th>Type</th>
        <th>Gender</th>
        <th>Tag</th>
        <th>English</th>
        <th>Kazakh</th>
        <th>Russian</th>
        <th>French</th>
        <th>Korean</th>
        <th>Japanese</th>
        <th>Pronunciation</th>
        <th>Date Added</th>
        <th>Remove</th>
    </tr>
<?php
    include('/var/www/creds.php');
    include('functions.php');
    
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    if (isset($_COOKIE['sessionID']) && isset($_COOKIE['username'])){
        $sessionID = test_input($_COOKIE['sessionID']);
        $username = test_input($_COOKIE['username']);
    }
    else{
        die();
    }

    $sql = "SELECT sessionID FROM users WHERE username = '$username'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $db_sessionID = $row['sessionID'];
        if ($sessionID != $db_sessionID) {
            die("Session ID does not match");
        }
    } else {
        die("User not found");
    }

    $sql = "SELECT * FROM words";
    $result = $conn->query($sql);

    $items = array();

    while($row = $result->fetch_assoc()) {
        $items[] = $row;
    }

    $items = array_reverse($items ,true);

    foreach($items as $row){
        $id = $row['id'];
        $word = $row['word'];
        $word_ka = $row['word_ka'];
        $word_ru = $row['word_ru'];
        $word_fr = $row['word_fr'];
        $word_kr = $row['word_kr'];
        $word_jp = $row['word_jp'];
        $word_pronunciation = $row['word_pronunciation'];
        $word_type = $row['word_type'];
        $word_tag = $row['word_tag'];
        $word_gender = $row['word_gender'];
        $date = $row['date_added'];

        echo "<tr id='" . $id . "' date_added='" . $date . "'>
            <td><textarea>" . $word_type . "</textarea></td>
            <td><textarea>" . $word_gender . "</textarea></td>
            <td><textarea>" . $word_tag . "</textarea></td>
            <td><textarea>" . $word .    "</textarea></td>
            <td><textarea>" . $word_ka . "</textarea></td>
            <td><textarea>" . $word_ru . "</textarea></td>
            <td><textarea>" . $word_fr . "</textarea></td>
            <td><textarea>" . $word_kr . "</textarea></td>
            <td><textarea>" . $word_jp . "</textarea></td>
            <td><textarea>" . $word_pronunciation . "</textarea></td>
            <td><textarea>" . $date . "</textarea></td>
            <td><button class='button remove_button' onclick='remove_word(" . $id . ")'><i class='fa-solid fa-xmark'></i></button></td>
        </tr>";
    }
?>
    </table>
</div>
<div id="wave_bottom">
    <svg viewBox="0 0 1000 150" preserveAspectRatio="none" style="height: 100%; width: 100%;">
        <path d="M1000,48.29c0,0-106.81,108.65-238.66,0s-261.34,0-261.34,0s-106.81,108.65-238.66,0S0,48.29,0,48.29V150h1000 V48.29z" style="stroke: none;fill: #f2e269;"></path>
    </svg>
</div>

<div id="popup-message" style="display: none; position: fixed; top: 20px; right: 20px; background-color: #4CAF50; color: white; padding: 15px; border-radius: 5px; z-index: 1000;">
</div>

<script>
    $(document).ready(function() {
        const saveChangesButton = $('#save-changes');
        saveChangesButton.attr('disabled', true);
        $('#word_list textarea').on('keypress', function(e) {
            if (e.which == 13) {
                e.preventDefault();
                var row = $(this).closest('tr');
                edit_word(row);
            }
        });
        $('#word_list textarea').on('input', function() {
            const row = $(this).closest('tr');
            row.attr('data-changed', 'true');
            const cell = $(this).closest('td');
            cell.css('background-color', '#f39f95');
            var button = $('#save-changes');
            if (button.attr('disabled')) {
                button.attr('disabled', false);
                button.css('cursor', 'pointer');
                button.css('opacity', '1');
                button.text('Save changes');
            }
        });

        // Save changes button functionality
        $('#save-changes').on('click', function() {
            const changedRows = $('#word_list tr[data-changed="true"]'); // Select all changed rows
            changedRows.each(function() {
                edit_word($(this)); // Submit each changed row
            });
        });
    });
    function submit_word(){
        $.ajax({
            type: 'POST',
            url: 'add_word.php',
            data: {
                type: $('#new_word tr:nth-child(2) td:nth-child(1) textarea').val(),
                gender: $('#new_word tr:nth-child(2) td:nth-child(2) textarea').val(),
                tag: $('#new_word tr:nth-child(2) td:nth-child(3) textarea').val(),
                english: $('#new_word tr:nth-child(2) td:nth-child(4) textarea').val(),
                kazakh: $('#new_word tr:nth-child(2) td:nth-child(5) textarea').val(),
                russian: $('#new_word tr:nth-child(2) td:nth-child(6) textarea').val(),
                french: $('#new_word tr:nth-child(2) td:nth-child(7) textarea').val(),
                korean: $('#new_word tr:nth-child(2) td:nth-child(8) textarea').val(),
                japanese: $('#new_word tr:nth-child(2) td:nth-child(9) textarea').val(),
                pronunciation: $('#new_word tr:nth-child(2) td:nth-child(10) textarea').val()
            },
            success: function(response) {
                location.reload();
            }
        });
    }

    function edit_word(row){
        $.ajax({
            type: 'POST',
            url: 'edit_word.php',
            data: {
                id: row.attr('id'),
                type: row.children('td:nth-child(1)').children('textarea').val(),
                gender: row.children('td:nth-child(2)').children('textarea').val(),
                tag: row.children('td:nth-child(3)').children('textarea').val(),
                english: row.children('td:nth-child(4)').children('textarea').val(),
                kazakh: row.children('td:nth-child(5)').children('textarea').val(),
                russian: row.children('td:nth-child(6)').children('textarea').val(),
                french: row.children('td:nth-child(7)').children('textarea').val(),
                korean: row.children('td:nth-child(8)').children('textarea').val(),
                japanese: row.children('td:nth-child(9)').children('textarea').val(),
                pronunciation: row.children('td:nth-child(10)').children('textarea').val(),
                date: row.children('td:nth-child(11)').children('textarea').val()
            },
            success: function(response) {
                const popup = $('#popup-message');
                popup.text("Word list changes have been saved !").fadeIn();
                setTimeout(() => {
                    popup.fadeOut();
                }, 2000);
                row.attr('data-changed', 'false');
                row.children('td').css('background-color', '#e7e0c4');
            }
        });
    }

    function remove_word(id){
        $.ajax({
            type: 'POST',
            url: 'remove_word.php',
            data: { id: id },
            success: function(response) {
                location.reload();
            }
        });
    }
</script>
</body>
</html>