<?php
include('/var/www/creds.php');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
  $pdo = new PDO("mysql:host={$servername};dbname={$DB_NAME};charset=utf8mb4", $username, $password, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);
} catch (Exception $e) {
  header('Content-Type: application/json');
  http_response_code(500);
  echo json_encode(['error'=>'DB connection failed','details'=>$e->getMessage()]);
  exit;
}
?>
