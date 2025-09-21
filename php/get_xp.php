<?php
include('/var/www/creds.php');
include('functions.php');

$connection = connect_user($servername, $username, $password, $dbname);
$conn = $connection['conn'];
$user_id = $connection['user_id'];
$username = $connection['username'];

$sql = "SELECT id FROM users WHERE username = '$username'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $id = $row['id'];

    $sql = "SELECT score FROM scores WHERE user_id = $id";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $pairs = array();
        $row = $result->fetch_assoc();
        $score = $row['score'];
        echo $score;
    }
    else{
        echo "0 results";
    }
} else {
    echo "0 results";
}
$conn->close();
?>