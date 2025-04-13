<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1">
    <link rel="icon" href="" type="image/x-icon">
    <title>profile</title>
    <script src="https://code.jquery.com/jquery-3.6.0.js"></script>
    <link rel="stylesheet" href="../style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Balsamiq+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Cherry+Bomb+One&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Sniglet:wght@800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Single+Day&display=swap" rel="stylesheet">
    <script src="https://kit.fontawesome.com/1c5060d9dc.js" crossorigin="anonymous"></script>
    <script src="../src/js/navigation.js"></script>
    <style>
        #title{
            margin-bottom: 200px;
        }

        #title i{
            font-size:40px;
            transform: translateY(-3px);
        }

        #title i:nth-child(1){
            margin-right: 10px;
            transform: scaleX(-1) translateY(-3px);
        }

        #title i:nth-child(2){
            margin-left: 10px;
        }

        #leaderboard_container{
            margin:0 auto;
            width:fit-content;
            text-align: center;
        }

        .leaderboard{
            text-align: center;
            display: inline-block;
            margin-left: 25px;
            margin-right: 25px;
        }

        .leaderboard h3{
            font-size: 25px;
            font-weight: bold;
            margin-top: 0px;
            margin-bottom: 0px;
        }

        .leaderboard p{
            margin-top: 0px;
        }
    </style>
</head>
<body>
<div id="wave_top">
    <svg viewBox="0 0 1000 150" preserveAspectRatio="none" style="height: 100%; width: 100%;">
        <path d="M1000,101.71c0,0-106.81-108.65-238.66,0s-261.34,0-261.34,0s-106.81-108.65-238.66,0S0,101.71,0,101.71V0h1000 V101.71z" style="stroke: none;fill: #f2e269;"></path>
    </svg>
</div>
<div id="title">
    <h1><i class="fa-solid fa-user"></i>profile<i class="fa-solid fa-user"></i></h1>
</div>
<div id="navigation"></div>
<div id="leaderboard_container">
<?php
include('/var/www/creds.php');

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

$sql = "SELECT id FROM users WHERE username = '$username'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $id = $row['id'];

    $sql = "SELECT score FROM scores WHERE user_id = $id";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $pairs = array();
        $row = $result->fetch_assoc();
        $score = $row['score'];
        echo '<div class="leaderboard"><img class="avatar" src="../src/avatars/' . $username . '.png"><h3>' . $username . '</h3><p>' . $score . ' xp</p></div>';
    }
    else{
        echo "0 results";
    }
} else {
    echo "0 results";
}
$conn->close();
?>
<br/>
<button id="logout_button" class='button'>Logout</button>
</div>
<div id="wave_bottom">
    <svg viewBox="0 0 1000 150" preserveAspectRatio="none" style="height: 100%; width: 100%;">
        <path d="M1000,48.29c0,0-106.81,108.65-238.66,0s-261.34,0-261.34,0s-106.81,108.65-238.66,0S0,48.29,0,48.29V150h1000 V48.29z" style="stroke: none;fill: #f2e269;"></path>
    </svg>
</div>
<script>
    $('#logout_button').click(function(){
        document.cookie = "sessionID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "../index.html";
    });
</script>
</body>
</html>