<?php
/**
 * Auth helpers: start session, get current user.
 */

// Đảm bảo không có output trước khi require config
if (!defined('DB_HOST')) {
    require_once __DIR__ . '/config.php';
}

function session_start_safe() {
    if (session_status() === PHP_SESSION_NONE) {
        ini_set('session.cookie_httponly', 1);
        ini_set('session.use_only_cookies', 1);
        session_name(SESSION_NAME);
        session_set_cookie_params([
            'lifetime' => SESSION_LIFETIME,
            'path' => '/',
            'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
            'samesite' => 'Lax'
        ]);
        session_start();
    }
}

function get_current_user_id() {
    session_start_safe();
    return $_SESSION['user_id'] ?? null;
}

function require_login() {
    $userId = get_current_user_id();
    if ($userId === null) {
        http_response_code(401);
        echo json_encode(['ok' => false, 'error' => 'Unauthorized']);
        exit;
    }
    return (int) $userId;
}
