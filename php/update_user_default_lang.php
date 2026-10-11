<?php
include('functions.php');
include($creds);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $connection = connect_user($servername, $username, $password, $dbname);
    $conn = $connection['conn'];
    $user_id = $connection['user_id'];
    $username = $connection['username'];

    $default_lang = test_input($_POST['default_lang']);
    $sql = "UPDATE users SET default_language='$default_lang' WHERE username='$username'";
    $result = $conn->query($sql);
    if ($result === FALSE) {
        echo "Error updating record: " . $conn->error . "<br>";
    } else {
        echo "Success";
    }
    $conn->close();
}
?>