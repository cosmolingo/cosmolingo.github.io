<?php
require 'db.php';
header('Content-Type: application/json');

function random_token($len=64){
  return bin2hex(random_bytes($len/2));
}

$game_code = substr(bin2hex(random_bytes(4)),0,8);
$player_token = random_token(64);

$board_state = [
  'player1_columns' => [ [], [], [] ],
  'player2_columns' => [ [], [], [] ],
  'roll' => null,
  'turn_token' => $player_token,
  'version' => 1
];

$stmt = $pdo->prepare("INSERT INTO games (game_code, player1_token, board_state, status) VALUES (?, ?, ?, 'waiting')");
$stmt->execute([$game_code, $player_token, json_encode($board_state)]);

$game_id = $pdo->lastInsertId();
echo json_encode(['game_code'=>$game_code, 'game_id'=>$game_id, 'token'=>$player_token]);
?>
