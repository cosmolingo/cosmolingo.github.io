<?php
include('/var/www/creds.php');
include('functions.php');

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$seed = date('z');

$sql = "SELECT word,word_ka FROM words
        ORDER BY RAND($seed)
        LIMIT 1
        ";
$result = $conn->query($sql);
$word = $result->fetch_assoc();

header('Content-Type: application/json');
echo json_encode($word);
?>