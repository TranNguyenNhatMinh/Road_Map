<?php
/**
 * GET: Current user info (if logged in)
 */

// Set JSON header first to prevent HTML output
header('Content-Type: application/json; charset=utf-8');

// Error handling wrapper
try {
    require_once __DIR__ . '/config.php';
    require_once __DIR__ . '/db.php';
    require_once __DIR__ . '/auth.php';
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Server configuration error: ' . $e->getMessage()]);
    exit;
}

session_start_safe();

$userId = get_current_user_id();
if ($userId === null) {
    echo json_encode(['ok' => true, 'user' => null]);
    exit;
}

$stmt = $pdo->prepare('SELECT id, email, display_name, created_at FROM users WHERE id = ?');
$stmt->execute([$userId]);
$user = $stmt->fetch();
if (!$user) {
    $_SESSION = [];
    echo json_encode(['ok' => true, 'user' => null]);
    exit;
}

echo json_encode([
    'ok' => true,
    'user' => [
        'id' => (int) $user['id'],
        'email' => $user['email'],
        'display_name' => $user['display_name'],
        'created_at' => $user['created_at']
    ]
]);
