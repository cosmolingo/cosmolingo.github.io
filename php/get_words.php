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
        $sessionID = '';
        $username = '';
    }
     
    $id = -1;
    if ($sessionID != '' && $username != ''){
        $sql = "SELECT id FROM users WHERE username = '$username'";
        $result = $conn->query($sql);
    
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $id = $row['id'];
        }
    }

    $sql = "SELECT * FROM words";
    $result = $conn->query($sql);

    $items = array();

    while($row = $result->fetch_assoc()) {
        $items[] = $row;
    }

    //$items = array_reverse($items ,true);

    foreach($items as $row){
        $word_id = $row['id'];
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
        if ($id != -1){
            $word_occ = $row['occ_' . $id];
            $word_occ_ok = $row['occ_ok_' . $id];
        }

        $output = $word_type;

        if ($word_gender != ''){
            $output = $output . '-' . $word_gender;
        }
        if ($word_tag != ''){
            $output = $output . ';' . $word_tag . ':';
        }
        else{
            $output = $output . ':';
        }
        $output = $output . $word_ka . ':' . $word . ':' . $word_fr;
        if ($word_pronunciation != ''){
            $output = $output . '(' . $word_pronunciation . ')';
        }
        $output = $output . ':' . $word_ru . ':' . $word_kr . ':' . $word_jp;
        if ($id != -1){
            $output = $output . ':' . $word_occ . ':' . $word_occ_ok;
        }
        else{
            $output = $output . '::';
        }
        echo $output . '<br/>';
    }
?>