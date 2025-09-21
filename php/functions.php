<?php

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function check_user_session($conn) {
    if (!isset($_COOKIE['sessionID']) || !isset($_COOKIE['username'])) {
        die("Not authenticated");
    }
    $sessionID = test_input($_COOKIE['sessionID']);
    $username = test_input($_COOKIE['username']);
    $sql = "SELECT sessionID, id FROM users WHERE username = '$username'";
    $result = $conn->query($sql);
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if ($sessionID !== $row['sessionID']) {
            die("Session ID does not match");
        }
        return [
            "user_id" => $row['id'],
            "username" => $username
        ];
    } else {
        die("User not found");
    }
}

function connect_user($servername, $username, $password, $dbname){
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $user_info = check_user_session($conn);
    $user_id = $user_info['user_id'];
    $username = $user_info['username'];

    return [
        'conn' => $conn,
        'user_id' => $user_id,
        'username' => $username
    ];
}
?>