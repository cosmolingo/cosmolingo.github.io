<?php
include('functions.php');
include('/var/www/creds.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $connection = connect_user($servername, $username, $password, $dbname);
    $conn = $connection['conn'];
    $user_id = $connection['user_id'];
    $username = $connection['username'];

    $category_name = test_input($_POST['name']);

    $sql = "INSERT INTO categories (user_id, name) VALUES ('$user_id', '$category_name')";
    $result = $conn->query($sql);

    if ($result === FALSE) {
        echo "Error adding category: " . $conn->error;
    } else {
        echo "Category added successfully";
    }
}
?>