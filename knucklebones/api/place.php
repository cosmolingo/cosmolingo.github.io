<?php
require 'db.php';
header('Content-Type: application/json');
$in = json_decode(file_get_contents('php://input'), true);
$code = $in['game_code'] ?? '';
$token = $in['token'] ?? '';
$col = isset($in['column_index']) ? intval($in['column_index']) : -1;

if (!$code || !$token) { http_response_code(400); echo json_encode(['error'=>'missing params']); exit; }
if ($col < 0 || $col > 2) { http_response_code(400); echo json_encode(['error'=>'invalid column']); exit; }

$pdo->beginTransaction();
$stmt = $pdo->prepare("SELECT * FROM games WHERE game_code = ? FOR UPDATE");
$stmt->execute([$code]);
$g = $stmt->fetch();
if (!$g) { $pdo->rollBack(); http_response_code(404); echo json_encode(['error'=>'not found']); exit; }

$board = json_decode($g['board_state'], true);

// determine which player is placing (slot 1 or 2)
$placerSlot = null;
if ($g['player1_token'] && hash_equals($g['player1_token'], $token)) $placerSlot = 1;
if ($g['player2_token'] && hash_equals($g['player2_token'], $token)) $placerSlot = 2;

if ($placerSlot === null) {
  $pdo->rollBack();
  http_response_code(403);
  echo json_encode(['error'=>'unknown player token']);
  exit;
}

// verify it's this player's turn
if (!isset($board['turn_token']) || !hash_equals($board['turn_token'], $token)) {
  $pdo->rollBack();
  http_response_code(403);
  echo json_encode(['error'=>'not your turn']);
  exit;
}

// verify there is a roll to place
if (!isset($board['roll']) || $board['roll'] === null) {
  $pdo->rollBack();
  http_response_code(400);
  echo json_encode(['error'=>'no roll to place']);
  exit;
}

// pick the correct columns array and enforce max height 3
$columnsKey = ($placerSlot === 1) ? 'player1_columns' : 'player2_columns';
if (!isset($board[$columnsKey]) || !is_array($board[$columnsKey])) $board[$columnsKey] = [[],[],[]];

$colHeight = count($board[$columnsKey][$col] ?? []);
if ($colHeight >= 3) {
  $pdo->rollBack();
  http_response_code(400);
  echo json_encode(['error'=>'column full','max'=>3]);
  exit;
}

// place the die
$dieValue = intval($board['roll']);
$board[$columnsKey][$col][] = $dieValue;
$board['roll'] = null;
$board['version'] = ($board['version'] ?? 1) + 1;

// toggle turn: if other player exists, switch to them; otherwise keep same (or end)
$other = null;
if ($placerSlot === 1 && $g['player2_token']) $other = $g['player2_token'];
if ($placerSlot === 2 && $g['player1_token']) $other = $g['player1_token'];
$board['turn_token'] = $other ?? $token;

$update = $pdo->prepare("UPDATE games SET board_state = ?, last_update = NOW() WHERE id = ?");
$update->execute([json_encode($board), $g['id']]);

$pdo->commit();
echo json_encode(['board'=>$board]);
?>
