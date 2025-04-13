<?php

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
return $data;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $servername = "localhost";
    $username = "root";
    $password = "RandoDumbai18";
    $dbname = "cosmolingo";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

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

    $sql = "INSERT INTO words (word,word_ka,word_ru,word_fr,word_kr,word_jp,word_pronunciation,word_type,word_tag,word_gender) VALUES ('$english','$kazakh','$russian','$french','$korean','$japanese','$pronunciation','$type','$tag','$gender')";
    $result = $conn->query($sql);
    
    if ($result === FALSE) {
        echo "Error updating record: " . $conn->error . "<br>";
    }
    else{
        echo "Success";
    }
}
?>