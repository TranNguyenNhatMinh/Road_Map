<?php
/**
 * Application config — edit these for your environment.
 */

// Set JSON header first to ensure all responses are JSON
header('Content-Type: application/json; charset=utf-8');

// Database
define('DB_HOST', 'localhost');
define('DB_NAME', 'database_project');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Session (for login)
define('SESSION_NAME', 'ROADMAP_SESSION');
define('SESSION_LIFETIME', 86400 * 7); // 7 days

// Security
define('PASSWORD_MIN_LENGTH', 6);

// CORS (allow frontend to call API from same origin or different port)
header('Access-Control-Allow-Origin: ' . (isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*'));
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
