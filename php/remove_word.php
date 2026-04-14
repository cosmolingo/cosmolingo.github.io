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

    $sql = "DELETE FROM words WHERE id='$id'";
    $result = $conn->query($sql);
    
    if ($result === FALSE) {
        echo "Error updating record: " . $conn->error . "<br>";
    }
    else{
        echo "Success";
    }
}
?>