<?php
include('/var/www/creds.php');
include('functions.php');

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

$sql = "SELECT default_language FROM users WHERE username = '$username'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $default_language = $row['default_language'];

    echo $default_language;
} else {
    echo "0 results";
}
$conn->close();
?>