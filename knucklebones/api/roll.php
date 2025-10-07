<?php
require 'db.php';
header('Content-Type: application/json');
$in = json_decode(file_get_contents('php://input'), true);
$code = $in['game_code'] ?? '';
$token = $in['token'] ?? '';

if (!$code || !$token) { http_response_code(400); echo json_encode(['error'=>'missing params']); exit; }

$pdo->beginTransaction();
$stmt = $pdo->prepare("SELECT * FROM games WHERE game_code = ? FOR UPDATE");
$stmt->execute([$code]);
$g = $stmt->fetch();
if (!$g) { $pdo->rollBack(); http_response_code(404); echo json_encode(['error'=>'not found']); exit; }
$board = json_decode($g['board_state'], true);

if (!isset($board['turn_token']) || !hash_equals($board['turn_token'],$token)) {
  $pdo->rollBack();
  http_response_code(403);
  echo json_encode(['error'=>'not your turn']);
  exit;
}
if ($board['roll'] !== null) {
  $pdo->rollBack();
  echo json_encode(['error'=>'roll already exists','board'=>$board]);
  exit;
}

$die = random_int(1,6);
$board['roll'] = $die;
$board['version'] = ($board['version'] ?? 1) + 1;

$upd = $pdo->prepare("UPDATE games SET board_state = ?, last_update = NOW() WHERE id = ?");
$upd->execute([json_encode($board), $g['id']]);

$pdo->commit();
echo json_encode(['die'=>$die, 'board'=>$board]);
?>