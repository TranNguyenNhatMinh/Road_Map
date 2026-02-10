<?php
/**
 * Test endpoint - kiểm tra PHP và API có hoạt động không
 * Truy cập: https://yourdomain.com/api/test.php
 */

header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'ok' => true,
    'message' => 'PHP is working!',
    'php_version' => phpversion(),
    'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'method' => $_SERVER['REQUEST_METHOD'] ?? 'Unknown',
    'timestamp' => date('Y-m-d H:i:s')
]);
