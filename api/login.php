<?php
/**
 * POST: Login
 * Body: { "email": "...", "password": "..." }
 */

// Tắt HTML error output và bắt tất cả errors
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set JSON header FIRST - trước mọi output
header('Content-Type: application/json; charset=utf-8');

// Function để output JSON error và exit
function jsonError($message, $code = 500) {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}

// Bắt tất cả errors và warnings
set_error_handler(function($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

// Bắt fatal errors
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== NULL && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => false, 'error' => 'Server error: ' . $error['message']]);
        exit;
    }
});

// Error handling wrapper
try {
    require_once __DIR__ . '/config.php';
    require_once __DIR__ . '/db.php';
    require_once __DIR__ . '/auth.php';
} catch (Exception $e) {
    jsonError('Server configuration error: ' . $e->getMessage(), 500);
} catch (Error $e) {
    jsonError('Server error: ' . $e->getMessage(), 500);
}

try {
    session_start_safe();
} catch (Exception $e) {
    jsonError('Session error: ' . $e->getMessage(), 500);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

try {
    $input = json_decode(file_get_contents('php://input'), true) ?: [];
    $email = isset($input['email']) ? trim($input['email']) : '';
    $password = $input['password'] ?? '';

    if ($email === '' || $password === '') {
        jsonError('Email and password are required', 400);
    }

    $stmt = $pdo->prepare('SELECT id, email, password_hash, display_name FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonError('Invalid email or password', 401);
    }

    $_SESSION['user_id'] = (int) $user['id'];
    $_SESSION['user_email'] = $user['email'];

    echo json_encode([
        'ok' => true,
        'user' => [
            'id' => (int) $user['id'],
            'email' => $user['email'],
            'display_name' => $user['display_name']
        ]
    ]);
} catch (PDOException $e) {
    jsonError('Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    jsonError('Login failed: ' . $e->getMessage(), 500);
} catch (Error $e) {
    jsonError('Server error: ' . $e->getMessage(), 500);
}
