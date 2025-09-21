<?php
include('/var/www/creds.php');
include('functions.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $connection = connect_user($servername, $username, $password, $dbname);
    $conn = $connection['conn'];
    $user_id = $connection['user_id'];
    $username = $connection['username'];

    $xp = test_input($_POST['xp']);

    $sql = "SELECT id FROM users WHERE username = '$username'";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $id = $row['id'];
        $sql = "UPDATE scores SET score=score+$xp WHERE user_id='$id'";
        $user_result = $conn->query($sql);
        if ($user_result === FALSE) {
            echo "Error updating record: " . $conn->error . "<br>";
            return;
        }
    } else {
        echo "User not found";
    }
}
?>