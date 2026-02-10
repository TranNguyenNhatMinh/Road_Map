<?php
/**
 * POST: Logout (destroy session)
 */

header('Content-Type: application/json; charset=utf-8');

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

function jsonError($message, $code = 500) {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}

try {
    require_once __DIR__ . '/config.php';
    require_once __DIR__ . '/auth.php';
} catch (Exception $e) {
    jsonError('Server configuration error: ' . $e->getMessage(), 500);
} catch (Error $e) {
    jsonError('Server error: ' . $e->getMessage(), 500);
}

try {
    session_start_safe();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
    echo json_encode(['ok' => true]);
} catch (Exception $e) {
    jsonError('Logout failed: ' . $e->getMessage(), 500);
}
