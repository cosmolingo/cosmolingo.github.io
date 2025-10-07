<?php
require 'db.php';
header('Content-Type: application/json');
$in = json_decode(file_get_contents('php://input'), true);
$code = $in['game_code'] ?? '';

if (!$code) { http_response_code(400); echo json_encode(['error'=>'missing game_code']); exit; }

$stmt = $pdo->prepare("SELECT * FROM games WHERE game_code = ?");
$stmt->execute([$code]);
$g = $stmt->fetch();
if (!$g) { http_response_code(404); echo json_encode(['error'=>'game not found']); exit; }

if ($g['player2_token'] === null) {
  $token = bin2hex(random_bytes(32));
  $update = $pdo->prepare("UPDATE games SET player2_token = ?, status = 'playing' WHERE id = ?");
  $update->execute([$token, $g['id']]);
  echo json_encode(['token'=>$token, 'slot'=>2, 'game_code'=>$code]);
  exit;
} else {
  echo json_encode(['message'=>'game already has two players']);
  exit;
}
?>