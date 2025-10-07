<?php
require 'db.php';
header('Content-Type: application/json');
$code = $_GET['game_code'] ?? '';
$token = $_GET['token'] ?? '';

if (!$code) { http_response_code(400); echo json_encode(['error'=>'missing game_code']); exit; }

$stmt = $pdo->prepare("SELECT * FROM games WHERE game_code = ?");
$stmt->execute([$code]);
$g = $stmt->fetch();
if (!$g) { http_response_code(404); echo json_encode(['error'=>'not found']); exit; }

$board = json_decode($g['board_state'], true);

$slot = 0;
if ($g['player1_token'] && hash_equals($g['player1_token'],$token)) $slot = 1;
if ($g['player2_token'] && hash_equals($g['player2_token'],$token)) $slot = 2;

if ($slot>0) {
  $u = $pdo->prepare("UPDATE games SET last_update = NOW() WHERE id = ?");
  $u->execute([$g['id']]);
}

echo json_encode([
  'board' => $board,
  'slot' => $slot,
  'player1_exists' => $g['player1_token'] !== null,
  'player2_exists' => $g['player2_token'] !== null
]);
?>