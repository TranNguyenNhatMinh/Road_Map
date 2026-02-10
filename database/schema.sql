-- Roadmap App: Database schema for users and user data
-- Run this script in MySQL/MariaDB to create the database and tables

CREATE DATABASE IF NOT EXISTS roadmap_db
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE roadmap_db;

-- Users table (login/register)
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB;

-- User vocabulary (English words - from Learn English feature)
CREATE TABLE IF NOT EXISTS user_vocabulary (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  english VARCHAR(255) NOT NULL,
  vietnamese VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  UNIQUE KEY unique_user_word (user_id, english(100))
) ENGINE=InnoDB;

-- Optional: store roadmap progress per user (CFA, Java, Frontend, Aptech completed items)
CREATE TABLE IF NOT EXISTS user_progress (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  roadmap_key VARCHAR(50) NOT NULL COMMENT 'e.g. frontend-tracker, java-roadmap-tracker, cfa-study-tracker, aptech-tracker',
  item_id VARCHAR(100) NOT NULL COMMENT 'module or item id',
  completed TINYINT(1) NOT NULL DEFAULT 1,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_progress (user_id, roadmap_key, item_id),
  INDEX idx_user_roadmap (user_id, roadmap_key)
) ENGINE=InnoDB;

-- Optional: learned words for flashcard (English feature)
CREATE TABLE IF NOT EXISTS user_learned_words (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  vocabulary_id INT UNSIGNED NOT NULL COMMENT 'references user_vocabulary.id',
  learned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (vocabulary_id) REFERENCES user_vocabulary(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_learned (user_id, vocabulary_id)
) ENGINE=InnoDB;
