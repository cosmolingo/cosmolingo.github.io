<?php
include('/var/www/creds.php');
include('functions.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $connection = connect_user($servername, $username, $password, $dbname);
    $conn = $connection['conn'];
    $user_id = $connection['user_id'];
    $username = $connection['username'];

    $word = addslashes(test_input($_POST['word']));
    $ok = test_input($_POST['is_ok']);

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