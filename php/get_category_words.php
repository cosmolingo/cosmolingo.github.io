<?php
include('/var/www/creds.php');
include('functions.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $connection = connect_user($servername, $username, $password, $dbname);
    $conn = $connection['conn'];
    $user_id = $connection['user_id'];
    $username = $connection['username'];

    $category_id = intval(test_input($_POST['category_id']));

    // Retrieve all words for the given category
    $sql = "SELECT w.word 
            FROM words w
            INNER JOIN category_words cw ON w.id = cw.word_id
            INNER JOIN categories c ON cw.category_id = c.id
            WHERE cw.category_id = '$category_id' AND c.user_id = '$user_id'";
    $result = $conn->query($sql);

    $words = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $words[] = $row['word'];
        }
    }

    header('Content-Type: application/json');
    echo json_encode($words);
}
?>