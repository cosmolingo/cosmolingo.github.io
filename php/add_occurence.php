<?php
#if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $servername = "localhost";
    $username = "root";
    $password = "RandoDumbai18";
    $dbname = "cosmolingo";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    #$word = $_POST['word'];
    #$username = $_POST['username'];
    $word = "cat";
    $username = "titan";

    $sql = "SELECT id FROM users WHERE username = '$username'";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $id = $row['id'];
        $sql = "UPDATE words SET occ_" . $id . "=occ_" . $id . "+1 WHERE word='$word'";
        $result = $conn->query($sql);
        if ($result === FALSE) {
            echo "Error updating record: " . $conn->error . "<br>";
        }
        $sql = "UPDATE words SET occ_ok_" . $id . "=occ_ok_" . $id . "+1 WHERE word='$word'";
        $result = $conn->query($sql);
        if ($result === FALSE) {
            echo "Error updating record: " . $conn->error . "<br>";
        }
    } else {
        echo "User not found";
    }
#}
?>