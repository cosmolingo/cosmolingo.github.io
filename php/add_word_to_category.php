<?php
include('/var/www/creds.php');
include('functions.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $connection = connect_user($servername, $username, $password, $dbname);
    $conn = $connection['conn'];
    $user_id = $connection['user_id'];
    $username = $connection['username'];

    $category_id = intval(test_input($_POST['category_id']));
    $word_value = addslashes(test_input($_POST['word']));

    // Get the word id from the words table
    $sql = "SELECT id FROM words WHERE word = '$word_value'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $word_id = $row['id'];

        // Insert into category_words
        $sql = "INSERT INTO category_words (category_id, word_id) VALUES ('$category_id', '$word_id')";
        $result = $conn->query($sql);

        // Increment word_count in categories table
        if ($result !== FALSE) {
            $update_sql = "UPDATE categories SET word_count = word_count + 1 WHERE id = '$category_id'";
            $conn->query($update_sql);
        }

        if ($result === FALSE) {
            echo "Error adding word to category: " . $conn->error;
        } else {
            echo "Word added to category successfully";
        }
    } else {
        echo "Word not found";
    }
}
?>