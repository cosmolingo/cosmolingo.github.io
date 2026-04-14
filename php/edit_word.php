<?php
include('/var/www/creds.php');
include('functions.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $connection = connect_user($servername, $username, $password, $dbname);
    $conn = $connection['conn'];
    $user_id = $connection['user_id'];
    $_username = $connection['username'];

    $is_admin = check_is_admin($servername, $username, $password, $dbname, $_username);

    if ($is_admin == false){
        die('User is not an admin !');
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
    $date = test_input($_POST['date']);

    $sql = "UPDATE words SET word='$english',word_ka='$kazakh',word_ru='$russian',word_fr='$french',word_kr='$korean',word_jp='$japanese',word_pronunciation='$pronunciation',word_type='$type',word_tag='$tag',word_gender='$gender',date_added='$date' WHERE id='$id'";
    $result = $conn->query($sql);
    
    if ($result === FALSE) {
        echo "Error updating record: " . $conn->error . "<br>";
    }
    else{
        echo "Success";
    }
}
?>