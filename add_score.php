<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $servername = "localhost";
    $username = "root";
    $password = "RouteRennes1756";
    $dbname = "cosmolingo";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $sql = "SELECT * FROM scores";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $user_id = $row['user_id'];
            $score = $row['score'];

            $user_sql = "SELECT username FROM users WHERE id = $user_id";
            $user_result = $conn->query($user_sql);

            if ($user_result->num_rows > 0) {
                $user_row = $user_result->fetch_assoc();
                $username = $user_row['username'];
                echo "Username: " . $username . " - Score: " . $score . "<br>";
            } else {
                echo "No user found for user_id: " . $user_id . "<br>";
            }
        }
    } else {
        echo "0 results";
    }
    $conn->close();
}
else{
    echo "not posted";
}
?>