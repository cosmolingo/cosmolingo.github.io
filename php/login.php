<?php
include('creds.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $username = test_input($_POST["username"]);
    $user_password = test_input($_POST["password"]);

    $sql = "SELECT hash,sessionID FROM users WHERE username = '$username'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $hash = $row['hash'];
        $sessionID = $row['sessionID'];
        if (password_verify($user_password, $hash)) {
            echo 'success<br/>' . $sessionID;
        } else {
            echo "failure<br/>Wrong password";
        }
    } else {
        echo "failure<br/>User not found";
    }
}

?>