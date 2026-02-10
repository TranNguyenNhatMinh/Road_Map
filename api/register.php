<?php
/**
 * POST: Register new user
 * Body: { "email": "...", "password": "...", "display_name": "..." (optional) }
 */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';

session_start_safe();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$email = isset($input['email']) ? trim($input['email']) : '';
$password = $input['password'] ?? '';
$displayName = isset($input['display_name']) ? trim($input['display_name']) : null;

if ($email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Email and password are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid email']);
    exit;
}

if (strlen($password) < PASSWORD_MIN_LENGTH) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Password must be at least ' . PASSWORD_MIN_LENGTH . ' characters']);
    exit;
}

$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['ok' => false, 'error' => 'Email already registered']);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare('INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)');
$stmt->execute([$email, $hash, $displayName ?: null]);
$userId = (int) $pdo->lastInsertId();

$_SESSION['user_id'] = $userId;
$_SESSION['user_email'] = $email;

echo json_encode([
    'ok' => true,
    'user' => [
        'id' => $userId,
        'email' => $email,
        'display_name' => $displayName
    ]
]);
