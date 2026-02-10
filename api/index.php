<?php
/**
 * API Index - Redirect hoặc hiển thị API info
 * Truy cập: https://yourdomain.com/api/
 */

header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'ok' => true,
    'message' => 'Roadmap API',
    'endpoints' => [
        'POST /api/login.php' => 'Login user',
        'POST /api/register.php' => 'Register new user',
        'GET /api/me.php' => 'Get current user',
        'POST /api/logout.php' => 'Logout',
        'GET /api/progress.php' => 'Get user progress',
        'POST /api/progress.php' => 'Save user progress'
    ],
    'test' => 'api/test.php',
    'debug' => 'api/debug.php'
]);
