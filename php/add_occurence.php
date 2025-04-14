<?php
include('/var/www/creds.php');
include('functions.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
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

    $word = addslashes($_POST['word']);
    $ok = $_POST['is_ok'];

    $sql = "SELECT id FROM users WHERE username = '$username'";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $id = $row['id'];
        if ($ok == 'true'){
            $sql = "UPDATE words SET occ_" . $id . "=occ_" . $id . "+1,occ_ok_" . $id ."=occ_ok_" . $id . "+1 WHERE word='$word'";
        } else {
            $sql = "UPDATE words SET occ_" . $id . "=occ_" . $id . "+1 WHERE word='$word'";
        }
        $result = $conn->query($sql);
        if ($result === FALSE) {
            echo "Error updating record: " . $conn->error . "<br>";
            return;
        }
        if ($ok == 'true'){
            $sql = "UPDATE scores SET score=score+2 WHERE user_id='$id'";
        } else {
            $sql = "UPDATE scores SET score=score+1 WHERE user_id='$id'";
        }
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