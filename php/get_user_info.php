<?php
include('/var/www/creds.php');
include('functions.php');

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$user_info = check_user_session($conn);
$user_id = $user_info['user_id'];
$username = $user_info['username'];

$sql = "SELECT id,default_language FROM users WHERE username = '$username'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $id = $row['id'];
    $lang = $row['default_language'];

    // Get user's categories
    $categories = array();
    $cat_sql = "SELECT id, name, word_count FROM categories WHERE user_id = $id";
    $cat_result = $conn->query($cat_sql);
    if ($cat_result && $cat_result->num_rows > 0) {
        while ($cat_row = $cat_result->fetch_assoc()) {
            $categories[] = array(
                "id" => $cat_row['id'],
                "name" => $cat_row['name'],
                "word_count" => $cat_row['word_count']
            );
        }
    }

    $sql = "SELECT score FROM scores WHERE user_id = $id";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $score = $row['score'];
        $response = array(
            "username" => $username,
            "score" => $score,
            "default_lang" => $lang,
            "categories" => $categories
        );
        header('Content-Type: application/json');
        echo json_encode($response);
    }
    else{
        die("0 results");
    }
} else {
    die("0 results");
}
$conn->close();
?>