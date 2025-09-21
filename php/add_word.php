<?php
include('/var/www/creds.php');
include('functions.php');
date_default_timezone_set('Europe/Paris');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
$connection = connect_user($servername, $username, $password, $dbname);
    $conn = $connection['conn'];
    $user_id = $connection['user_id'];
    $username = $connection['username'];

    $type = test_input($_POST['type']);
    $gender = test_input($_POST['gender']);
    $tag = test_input($_POST['tag']);
    $english = test_input($_POST['english']);
    $kazakh = test_input($_POST['kazakh']);
    $russian = test_input($_POST['russian']);
    $french = test_input($_POST['french']);
    $korean = test_input($_POST['korean']);
    $japanese = test_input($_POST['japanese']);
    $pronunciation = test_input($_POST['pronunciation']);
    $date = date("Y-m-d H:i:s");
    #$type = "n";
    #$gender = "m";
    #$tag = "animal";
    #$english = "test";
    #$kazakh = "testka";
    #$russian = "testru";
    #$french = "testfr";
    #$korean = "testkr";
    #$japanese = "testjp";
    #$pronunciation = "testpron";

    $sql = "INSERT INTO words (word,word_ka,word_ru,word_fr,word_kr,word_jp,word_pronunciation,word_type,word_tag,word_gender,date_added) VALUES ('$english','$kazakh','$russian','$french','$korean','$japanese','$pronunciation','$type','$tag','$gender','$date')";
    $result = $conn->query($sql);
    
    if ($result === FALSE) {
        echo "Error updating record: " . $conn->error . "<br>";
    }
    else{
        echo "Success";
    }
}
?>