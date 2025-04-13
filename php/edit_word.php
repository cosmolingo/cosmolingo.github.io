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

    $id = test_input($_POST['id']);
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

    $sql = "UPDATE words SET word='$english',word_ka='$kazakh',word_ru='$russian',word_fr='$french',word_kr='$korean',word_jp='$japanese',word_pronunciation='$pronunciation',word_type='$type',word_tag='$tag',word_gender='$gender' WHERE id='$id'";
    $result = $conn->query($sql);
    
    if ($result === FALSE) {
        echo "Error updating record: " . $conn->error . "<br>";
    }
    else{
        echo "Success";
    }
}
?>