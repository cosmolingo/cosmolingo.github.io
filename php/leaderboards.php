<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1">
    <link rel="icon" href="" type="image/x-icon">
    <title>leaderboards</title>
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
    <h1><i class="fa-solid fa-ranking-star"></i>leaderboard<i class="fa-solid fa-ranking-star"></i></h1>
</div>
<div id="navigation"></div>
<div id="leaderboard_container">
<?php
include('/var/www/creds.php');
include('functions.php');

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$sql = "SELECT * FROM scores";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $pairs = array();
    while($row = $result->fetch_assoc()) {
        $user_id = $row['user_id'];
        $score = $row['score'];

        $user_sql = "SELECT username FROM users WHERE id = $user_id";
        $user_result = $conn->query($user_sql);

        if ($user_result->num_rows > 0) {
            $user_row = $user_result->fetch_assoc();
            $username = $user_row['username'];
            #$pairs[] = array("username" => $username, "score" => $score);
            echo '<div class="leaderboard"><img class="avatar" src="../src/avatars/' . $username . '.png"><h3>' . $username . '</h3><p>' . $score . ' xp</p></div>';
        }
    }
    #echo json_encode($pairs);
} else {
    echo "0 results";
}
$conn->close();
?>
</div>
<div id="wave_bottom">
    <svg viewBox="0 0 1000 150" preserveAspectRatio="none" style="height: 100%; width: 100%;">
        <path d="M1000,48.29c0,0-106.81,108.65-238.66,0s-261.34,0-261.34,0s-106.81,108.65-238.66,0S0,48.29,0,48.29V150h1000 V48.29z" style="stroke: none;fill: #f2e269;"></path>
    </svg>
</div>
</body>
</html>