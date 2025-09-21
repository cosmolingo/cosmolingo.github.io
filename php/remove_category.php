<?php
include('functions.php');
include('/var/www/creds.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $connection = connect_user($servername, $username, $password, $dbname);
    $conn = $connection['conn'];
    $user_id = $connection['user_id'];
    $username = $connection['username'];

    $category_id = intval(test_input($_POST['category_id']));

    // Ensure the category belongs to the user
    $sql = "DELETE FROM categories WHERE id = '$category_id' AND user_id = '$user_id'";
    $result = $conn->query($sql);

    if ($result === FALSE) {
        echo "Error removing category: " . $conn->error;
    } else {
        echo "Category removed successfully";
    }
}
?>