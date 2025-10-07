CREATE TABLE games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  game_code VARCHAR(32) NOT NULL UNIQUE,
  player1_token CHAR(64) DEFAULT NULL,
  player2_token CHAR(64) DEFAULT NULL,
  board_state JSON NOT NULL,
  status ENUM('waiting','playing','finished') NOT NULL DEFAULT 'waiting',
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_game_code ON games(game_code);
