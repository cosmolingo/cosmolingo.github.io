<?php
include('creds.php');

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sessionID = test_input($_COOKIE['sessionID']);
$username = test_input($_COOKIE['username']);
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