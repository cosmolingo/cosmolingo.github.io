<?php
$servername = "localhost";
$username = "root";
$password = "RandoDumbai18";
$dbname = "cosmolingo";

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
?>