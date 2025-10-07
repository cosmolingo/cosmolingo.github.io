<?php
// api/set_name.php
require 'db.php';
header('Content-Type: application/json');

// read JSON input
$in = json_decode(file_get_contents('php://input'), true);
$game_code = $in['game_code'] ?? '';
$token = $in['token'] ?? '';
$name_raw = $in['name'] ?? '';

if (!$game_code || !$token) {
  http_response_code(400);
  echo json_encode(['error'=>'missing params']);
  exit;
}

// sanitize & validate name
$name = trim($name_raw);
$name = strip_tags($name); // remove HTML
if ($name === '') {
  // allow empty name, but coerce to default later if you wish
  $name = '';
}
if (mb_strlen($name) > 32) {
  http_response_code(400);
  echo json_encode(['error'=>'name too long (max 32)']);
  exit;
}

try {
  $pdo->beginTransaction();
  $stmt = $pdo->prepare("SELECT * FROM games WHERE game_code = ? FOR UPDATE");
  $stmt->execute([$game_code]);
  $g = $stmt->fetch();
  if (!$g) {
    $pdo->rollBack();
    http_response_code(404);
    echo json_encode(['error'=>'game not found']);
    exit;
  }

  $board = json_decode($g['board_state'], true);
  if (!is_array($board)) $board = [];

  // decide which slot this token belongs to
  $slot = null;
  if ($g['player1_token'] && hash_equals($g['player1_token'], $token)) $slot = 1;
  if ($g['player2_token'] && hash_equals($g['player2_token'], $token)) $slot = 2;

  if ($slot === null) {
    $pdo->rollBack();
    http_response_code(403);
    echo json_encode(['error'=>'unknown player token']);
    exit;
  }

  // set appropriate name key
  if ($slot === 1) {
    $board['player1_name'] = $name;
  } else {
    $board['player2_name'] = $name;
  }

  // bump version so clients get update
  $board['version'] = ($board['version'] ?? 1) + 1;

  $upd = $pdo->prepare("UPDATE games SET board_state = ?, last_update = NOW() WHERE id = ?");
  $upd->execute([json_encode($board), $g['id']]);

  $pdo->commit();
  echo json_encode(['board'=>$board]);
} catch (Exception $e) {
  if ($pdo->inTransaction()) $pdo->rollBack();
  http_response_code(500);
  echo json_encode(['error'=>'server error','details'=>$e->getMessage()]);
}
