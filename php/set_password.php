<?php
    include('creds.php');
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $username = '';
    $user_sessionID = '';
    $hashed_password = password_hash($user_sessionID, PASSWORD_DEFAULT);
    $sql = "UPDATE users SET sessionID='$hashed_password' WHERE username='$username'";
    $result = $conn->query($sql);
    echo $result;
?>